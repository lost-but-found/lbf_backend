import express, { Router } from "express";
import AuthController from "./auth.controller";
import upload from "../../middleware/upload";
import validateRequest from "../../middleware/validateRequest";
import { registerUserSchema } from "./auth.schema";

const AuthRouter: Router = express.Router();

AuthRouter.get("/check", AuthController.checkIfEmailOrPhoneExists);
AuthRouter.post(
  "/register",
  upload.single("photo"),
  validateRequest(registerUserSchema),
  AuthController.register
);

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logout", AuthController.logout);
AuthRouter.get("/refresh-token", AuthController.refreshToken);

// OTP
AuthRouter.post("/otp", AuthController.sendOTPToUser);
AuthRouter.post("/otp/resend", AuthController.resendOTP);
// @ts-ignore
AuthRouter.post("/otp/verify/email", AuthController.verifyEmailOTP);
// @ts-ignore
AuthRouter.post("/otp/verify/phone", AuthController.verifyPhoneOTP);

export default AuthRouter;
