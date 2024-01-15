import crypto from "crypto";
import PaymentModel, { IPayment } from "./payment.model";
import { StatusCodes } from "http-status-codes";
import paystack from "../../utils/paystack";

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
    email,
    postId,
  }: {
    userId: string;
    postId: string;
    email: string;
  }) {
    try {
      const amount = 1000;
      const paymentUrl = await paystack.initializeTransaction({
        amount: 1000,
        email,
        post: postId,
        user: userId,
      });
      const result: IPayment = await PaymentModel.create({
        user: userId,
        amount: amount * 10,
        email,
        post: postId,
        paymentUrl,
      });

      return result;
    } catch (error) {
      throw new Error("Failed to add payment.");
    }
  }

  async getPayment(paymentId: string) {
    try {
      return await PaymentModel.findById(paymentId)
        .select("-searchText")
        .exec();
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
    // Handle the event
    switch (event.type) {
      case "charge.success":
        // const paymentIntent = event.data.object;
        // Handle successful payment
        break;
      case "payment_intent.payment_failed":
        // Handle failed payment
        break;
    }

    return true;
  }
}

export default new PaymentService();
