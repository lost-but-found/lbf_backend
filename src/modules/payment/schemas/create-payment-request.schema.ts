import { object, string, TypeOf, number } from "zod";

export const createPaymentRequestSchema = object({
  body: object({
    itemId: string({
      required_error: "Post ID is required",
    }),
    amount: number().optional(),
  }),
});

export type CreatePaymentRequestInput = TypeOf<
  typeof createPaymentRequestSchema
>["body"];
