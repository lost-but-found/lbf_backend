import { ReportModel, IReport, ReportReason } from "./report.model";
import { IUser } from "../user";

class ReportService {
  async createReport(
    user: IUser,
    reason: ReportReason,
    message?: string
  ): Promise<IReport> {
    try {
      const newReport = await ReportModel.create({ user, reason, message });
      return newReport;
    } catch (error) {
      throw new Error("Failed to create report.");
    }
  }

  async getReports(
    page: number,
    limit: number
  ): Promise<{ reports: IReport[]; total: number }> {
    try {
      const skipCount = page * limit;
      const [reports, totalReportsCount] = await Promise.all([
        ReportModel.find().sort({ createdAt: -1 }).skip(skipCount).limit(limit),
        ReportModel.countDocuments(),
      ]);
      return {
        reports,
        total: totalReportsCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch reports.");
    }
  }
}

export default new ReportService();
