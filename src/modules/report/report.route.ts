import express from "express";
import ReportController from "./report.controller";
import validateRequest from "../../middleware/validateRequest";
import { makeReportSchema } from "./schemas/make-report.schema";

const router = express.Router();

router.post(
  "/",
  validateRequest(makeReportSchema),
  ReportController.createReport
);
router.get("/", ReportController.getReports);

export default router;
