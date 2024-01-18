import crypto from "crypto";
import PaymentModel, { IPayment } from "./payment.model";
import { StatusCodes } from "http-status-codes";
import paystack from "../../utils/paystack";
import { PaymentStatus } from ".";
import { ItemService } from "../item";
import { UserService } from "../user";

class PaymentService {
  async getPayments(userId: string, query: any, page: number, limit: number) {
    try {
      console.log({ page, limit });
      const skipCount = Math.max(page - 1, 0) * limit;

      const payments = await PaymentModel.find(query)
        .skip(skipCount)
        .limit(limit)
        .exec();

      return {
        payments,
        totalPaymentsCount: 0,
      };
    } catch (error) {
      console.log({ error });
      throw new Error("Failed to retrieve payments.");
    }
  }

  async createPayment({ userId, itemId }: { userId: string; itemId: string }) {
    try {
      const amount = 1000;
      const [item, user] = await Promise.all([
        ItemService.getItem(itemId),
        UserService.getUser(userId),
      ]);
      if (!item || !user) {
        return;
      }
      const paymentUrl = await paystack.initializeTransaction({
        amount: 1000,
        email: user.email,
        item: itemId,
        user: userId,
      });
      const result: IPayment = await PaymentModel.create({
        user: userId,
        amount: amount * 10,
        email: user.email,
        item: itemId,
        paymentUrl,
      });

      return result;
    } catch (error) {
      throw new Error("Failed to add payment.");
    }
  }

  async getPayment(paymentId: string) {
    try {
      return await PaymentModel.findById(paymentId).exec();
    } catch (error) {
      throw new Error("Failed to retrieve payment.");
    }
  }

  async verifyPayment({ userId, itemId }: { userId: string; itemId: string }) {
    try {
      return await PaymentModel.findOne({
        item: itemId,
        user: userId,
        status: PaymentStatus.COMPLETED,
      }).exec();
    } catch (error) {
      throw new Error("Failed to retrieve payment.");
    }
  }

  async updatePaymentStatus(
    signature: string,
    event: {
      type: string;
    }
  ) {
    const hash = paystack.verifyHash(event);
    if (hash == signature) {
      return;
    }

    console.log({ event });

    const payment = await PaymentModel.findById("");

    if (!payment) {
      return;
    }
    // Handle the event
    switch (event.type) {
      case "charge.success":
        // const paymentIntent = event.data.object;
        payment.status = PaymentStatus.COMPLETED;
        break;
      case "payment_intent.payment_failed":
        // Handle failed payment
        payment.status = PaymentStatus.FAILED;
        break;
      default:
        payment.status = PaymentStatus.FAILED;
    }

    await payment.save();

    return true;
  }
}

export default new PaymentService();
