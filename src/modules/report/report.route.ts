import express from "express";
import ReportController from "./report.controller";

const router = express.Router();

router.post("/", ReportController.createReport);
router.get("/", ReportController.getReports);

export default router;
