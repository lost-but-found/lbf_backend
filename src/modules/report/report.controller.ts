import { Request, Response } from "express";
import ReportService from "./report.service";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "../user";
import { StatusCodes } from "http-status-codes";

class ReportController {
  createReport = async (req: Request, res: Response) => {
    const { user, reason, message } = req.body;
    try {
      const userData = await UserService.getUser(user);
      if (!userData) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          message: "No such user!",
          success: false,
        });
      }
    } catch (error) {
      return sendResponse({
        res,
        status: StatusCodes.NOT_FOUND,
        message: "No such user!",
        success: false,
      });
    }
    try {
      const newReport = await ReportService.createReport(user, reason, message);

      //   return res.status(201).json(newReport);
      return sendResponse({
        res,
        status: 201,
        message: "Report created successfully.",
        success: true,
      });
    } catch (error) {
      console.log({ error });
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
