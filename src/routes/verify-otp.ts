import express, { Router } from "express";

import { verifyOTPFunc } from "../controllers/verifyOTPController";

const router: Router = express.Router();

router.post("/", verifyOTPFunc);

export default router;
