import express, { Router } from "express";
import PaymentController from "./payment.controller";

const PaymentRouter: Router = express.Router();

PaymentRouter.post("/", PaymentController.createPayment);

PaymentRouter.get("/verify/:userId/:postId", PaymentController.verifyPayment);

PaymentRouter.get(
  "/confirm-payment-webhook",
  PaymentController.updatePaymentStatus
);

PaymentRouter.get("/:id", PaymentController.getPayment);

export default PaymentRouter;
