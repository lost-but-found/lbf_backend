import express from "express";
import ReportController from "./report.controller";
import validateRequest from "../../middleware/validateRequest";
import { makeReportSchema } from "./schemas/make-report.schema";
import { isAuth } from "../auth/auth.middleware";

const router = express.Router();

router.post(
  "/",
  isAuth,
  validateRequest(makeReportSchema),
  ReportController.createReport
);
router.get("/", isAuth, ReportController.getReports);

export default router;
