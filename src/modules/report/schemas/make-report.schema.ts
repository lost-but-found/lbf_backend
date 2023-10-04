import { isValidObjectId } from "mongoose";
import { any, nativeEnum, array, object, string, TypeOf } from "zod";
import { ReportReason } from "../report.type";

export const makeReportSchema = object({
  body: object({
    user: string({
      required_error: "User is required",
    }),
    message: string().optional(),
    // .min(10, "Description is too short - should be 10 chars minimum")
    reason: nativeEnum(ReportReason, {
      required_error: "Reasons is required",
      invalid_type_error: "Invalid Reason",
    }),
  }),
});

export type MakeReportInput = TypeOf<typeof makeReportSchema>;
