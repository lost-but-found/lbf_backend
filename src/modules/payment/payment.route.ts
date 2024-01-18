import express, { Router } from "express";
import PaymentController from "./payment.controller";
import validateRequest from "../../middleware/validateRequest";
import { createPaymentRequestSchema } from "./schemas/create-payment-request.schema";
import { isAuth } from "../auth/auth.middleware";

const PaymentRouter: Router = express.Router();

PaymentRouter.post(
  "/",
  isAuth,
  validateRequest(createPaymentRequestSchema),
  PaymentController.createPayment
);

PaymentRouter.get("/verify/:itemId", isAuth, PaymentController.verifyPayment);

PaymentRouter.get("/confirm-payment", PaymentController.updatePaymentStatus);

PaymentRouter.get("/webhook", PaymentController.updatePaymentStatus);

PaymentRouter.get("/:id", PaymentController.getPayment);

export default PaymentRouter;
