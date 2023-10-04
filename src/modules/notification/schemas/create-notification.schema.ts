import { object, string, TypeOf } from "zod";

export const createNotificationSchema = object({
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    content: string({
      required_error: "Content is required",
    }),
  }),
});

export type CreateNotificationInput = TypeOf<typeof createNotificationSchema>;
