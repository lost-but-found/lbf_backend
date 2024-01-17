import { any, nativeEnum, array, object, string, TypeOf, boolean } from "zod";

export const createPaymentRequestSchema = object({
  body: object({
    itemId: string({
      required_error: "Post ID is required",
    }),
  }),
});

export type CreatePaymentRequestInput = TypeOf<
  typeof createPaymentRequestSchema
>["body"];
