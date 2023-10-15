import { isValidObjectId } from "mongoose";
import { object, string, TypeOf } from "zod";

export const createItemCommentSchema = object({
  body: object({
    text: string({
      required_error: "Text is required",
    }),
  }),
});

export type CreateItemCommentInput = TypeOf<typeof createItemCommentSchema>;
