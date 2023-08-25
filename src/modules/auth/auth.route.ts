import express, { Router } from "express";
import AuthController from "./auth.controller";
import upload from "../../middleware/upload";
import validateRequest from "../../middleware/validateRequest";
import {
  registerUserSchema,
  requestEmailOTPSchema,
  requestPhoneOTPSchema,
  verifyEmailOTPSchema,
  verifyPhoneOTPSchema,
} from "./schemas/register.schema";
import {
  changePasswordSchema,
  requestChangePasswordSchema,
  verifyChangePasswordRequestSchema,
} from "./schemas/forgot-password.schema";

const AuthRouter: Router = express.Router();

AuthRouter.get("/check", AuthController.checkIfEmailOrPhoneExists);
AuthRouter.post(
  "/register",
  // upload.single("photo"),
  validateRequest(registerUserSchema),
  AuthController.register
);

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logout", AuthController.logout);
AuthRouter.get("/refresh-token", AuthController.refreshToken);

// OTP
AuthRouter.post(
  "/otp/email",
  validateRequest(requestEmailOTPSchema),
  AuthController.sendEmailOTP
);
AuthRouter.post(
  "/otp/phone",
  validateRequest(requestPhoneOTPSchema),
  AuthController.sendPhoneOTP
);
AuthRouter.post("/otp/resend", AuthController.resendOTP);
// @ts-ignore
AuthRouter.post(
  "/otp/email/verify",
  validateRequest(verifyEmailOTPSchema),
  AuthController.verifyEmailOTP
);
// @ts-ignore
AuthRouter.post(
  "/otp/phone/verify",
  validateRequest(verifyPhoneOTPSchema),
  AuthController.verifyPhoneOTP
);

// Forgot password
AuthRouter.post(
  "/forgot-password",
  validateRequest(requestChangePasswordSchema),
  AuthController.requestPasswordReset
);
AuthRouter.post(
  "/forgot-password/verify",
  validateRequest(verifyChangePasswordRequestSchema),
  AuthController.verifyPasswordReset
);
AuthRouter.post(
  "/forgot-password/change",
  validateRequest(changePasswordSchema),
  AuthController.resetPassword
);

export default AuthRouter;
