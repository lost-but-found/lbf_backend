import { Request, Response } from "express";
import ReportService from "./report.service";
import { sendResponse } from "../../utils/sendResponse";

class ReportController {
  createReport = async (req: Request, res: Response) => {
    try {
      const { user, reason, message } = req.body;
      const newReport = await ReportService.createReport(user, reason, message);
      //   return res.status(201).json(newReport);
      return sendResponse({
        res,
        status: 201,
        message: "Report created successfully.",
        success: true,
      });
    } catch (error) {
      //   return res.status(500).json({ error: "Failed to create report." });
      return sendResponse({
        res,
        status: 500,
        message: "Failed to create report.",
        success: false,
      });
    }
  };

  getReports = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const reports = await ReportService.getReports(page - 1, limit);

      return sendResponse({
        res,
        status: 200,
        message: "Reports fetched successfully.",
        success: true,
        data: reports,
      });
    } catch (error) {
      return sendResponse({
        res,
        status: 500,
        message: "Failed to fetch reports.",
        success: false,
      });
    }
  };
}

export default new ReportController();
