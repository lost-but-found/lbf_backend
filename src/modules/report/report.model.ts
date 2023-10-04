import { Schema, Document, model, Types } from "mongoose";
import { IUser } from "../user";
import { ReportReason } from "./report.type";

interface IReport extends Document {
  user: Types.ObjectId | IUser;
  reason: ReportReason;
  message?: string;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    enum: Object.values(ReportReason),
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReportModel = model<IReport>("Report", reportSchema);

export { ReportModel, IReport, ReportReason };
