import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import PaymentService from "./payment.service";
import mongoose from "mongoose";

class PaymentController {
  async getPayments(req: Request, res: Response) {
    try {
      if (!req.userId)
        return sendResponse({
          res,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Failed to retrieve Payments: No user found",
          success: false,
        });

      const {
        date_from,
        date_to,
        // type,
        isFound,
        poster,
      } = req.query;
      const { page, limit } = req.query;

      let query: any = {};

      // query = {
      //   ...query,
      // };

      const pageAsNumber = parseInt((page ?? "1") as string);
      const limitAsNumber = parseInt((limit ?? "10") as string);
      console.log({ query });
      const result = await PaymentService.getPayments(
        req.userId,
        query,
        pageAsNumber,
        limitAsNumber
      );

      return sendResponse({
        res,
        message: "All Payments retrieved!",
        data: {
          Payments: result.payments,
          page: pageAsNumber,
          limit: limitAsNumber,
          total: result.totalPaymentsCount,
          hasMore: result.payments.length < result.totalPaymentsCount,
        },
        success: true,
      });
    } catch (error: any) {
      console.log({ error });
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve Payments!",
        error: error,
        success: false,
      });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const PaymentId = req.params.id;
      const Payment = await PaymentService.getPayment(PaymentId);

      if (Payment) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Payment retrieved!",
          data: Payment,
          success: true,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Payment not retrieved!",
        error: error,
        success: false,
      });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const { email, postId, userId } = req.body;
      const payment = await PaymentService.createPayment({
        email,
        postId,
        userId,
      });

      if (payment) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Payment retrieved!",
          data: payment,
          success: true,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Payment not retrieved!",
        error: error,
        success: false,
      });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    const sig = req.headers["x-paystack-signature"] as string;

    try {
      PaymentService.updatePaymentStatus(sig, req.body);
      // return sendResponse({
      //   res,
      //   status: StatusCodes.OK,
      //   message: "Completed!",
      //   data: { received: true },
      //   success: true,
      // });
      res.json({ received: true });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Unable to process event",
        error: error,
        success: false,
      });
    }
  }
}

export default new PaymentController();
