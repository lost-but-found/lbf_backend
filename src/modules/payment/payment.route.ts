import express, { Router } from "express";
import PaymentController from "./payment.controller";

const PaymentRouter: Router = express.Router();

PaymentRouter.post("/", PaymentController.createPayment);

PaymentRouter.get("/:id", PaymentController.getPayment);
PaymentRouter.get(
  "/confirm-payment-webhook",
  PaymentController.updatePaymentStatus
);

export default PaymentRouter;
