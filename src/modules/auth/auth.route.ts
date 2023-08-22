import express, { Router } from "express";
import AuthController from "./auth.controller";
import upload from "../../middleware/upload";

const AuthRouter: Router = express.Router();

AuthRouter.get("/check", AuthController.checkIfEmailOrPhoneExists);
AuthRouter.post("/register", upload.single("photo"), AuthController.register);

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logout", AuthController.logout);
AuthRouter.get("/refresh-token", AuthController.refreshToken);

// OTP
AuthRouter.post("/otp", AuthController.sendOTPToUser);
AuthRouter.post("/otp/resend", AuthController.resendOTP);
AuthRouter.post("/otp/verify", AuthController.verifyOTP);

export default AuthRouter;
