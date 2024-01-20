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

  async createPayment({
    userId,
    itemId,
    amount,
  }: {
    userId: string;
    itemId: string;
    amount: number;
  }) {
    try {
      const checkedAmount = Math.max(500, amount);
      const [item, user] = await Promise.all([
        ItemService.getItem(itemId),
        UserService.getUser(userId),
        // PaymentModel.findOne()
      ]);
      if (!item || !user) {
        return;
      }

      const newPayment = new PaymentModel({
        user: userId,
        amount: checkedAmount * 10,
        email: user.email,
        item: itemId,
        // paymentUrl,
      });

      const paymentUrl = await paystack.initializeTransaction({
        amount: checkedAmount,
        email: user.email,
        item: itemId,
        user: userId,
        payment: newPayment.id,
      });
      newPayment.paymentUrl = paymentUrl;
      await newPayment.save();

      return newPayment;
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

  async verifyPayment({
    userId,
    itemId,
    status,
  }: {
    userId: string;
    itemId: string;
    status?: PaymentStatus;
  }) {
    try {
      const payment = await PaymentModel.findOne({
        item: itemId,
        user: userId,
        ...(status ? { status } : {}),
      }).exec();

      if (payment) {
        return payment;
      } else {
        return {
          status: PaymentStatus.NOT_MADE,
        };
      }
    } catch (error) {
      console.log({ error });
      throw new Error("Failed to retrieve payment.");
    }
  }

  async updatePaymentStatus(
    signature: string,
    event: {
      event: string;
      data: {
        metadata: {
          item: string;
          user: string;
          payment: string;
        };
      };
    }
  ) {
    const hash = paystack.verifyHash(event);
    if (hash !== signature) {
      return false;
    }

    console.log({ event: event.data.metadata });

    const payment = await PaymentModel.findById(event.data.metadata.payment);

    if (!payment) {
      return false;
    }
    // Handle the event
    switch (event.event) {
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
