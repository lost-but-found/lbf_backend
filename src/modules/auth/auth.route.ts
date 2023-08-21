import express, { Router } from "express";
import AuthController from "./auth.controller";
import upload from "../../middleware/upload";

const AuthRouter: Router = express.Router();

AuthRouter.post("/", AuthController.login);
AuthRouter.get("/", AuthController.refreshToken);
AuthRouter.post("/", upload.single("photo"), AuthController.register);
AuthRouter.post("/", AuthController.sendOTPToUser);
AuthRouter.post("/", AuthController.verifyOTP);

export default AuthRouter;
