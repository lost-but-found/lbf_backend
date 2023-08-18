import express, { Router } from "express";

import { sendOTPToUser } from "../controllers/resendOTPController";

const router: Router = express.Router();

router.post("/", sendOTPToUser);

export default router;
