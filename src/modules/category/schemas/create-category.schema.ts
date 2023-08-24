import { any, object, string, TypeOf } from "zod";

export const createCategorySchema = object({
  body: object({
    name: string({
      required_error: "Category Name is required",
    }),
    description: string()
      .min(10, "Description is too short - should be 10 chars minimum")
      .optional(),
    photo: string().optional(),
  }),
  //   .refine((data) => data.password === data.passwordConfirmation, {
  //     message: "Passwords do not match",
  //     path: ["passwordConfirmation"],
  //   }),
  // file: object({
  //   fieldname: string({
  //     required_error: "fieldname is required",
  //   }),
  //   originalname: string({
  //     required_error: "originalname is required",
  //   }),
  //   encoding: string({
  //     required_error: "encoding is required",
  //   }),
  //   mimetype: string({
  //     required_error: "mimetype is required",
  //   }),
  //   buffer: any({
  //     required_error: "buffer is required",
  //   }),
  // })
  //   .refine((data) => data.mimetype.includes("image"), {
  //     message: "File must be an image",
  //     path: ["mimetype"],
  //   })
  //   .refine((data) => data.fieldname === "photo", {
  //     message: "File must be a photo",
  //     path: ["fieldname"],
  //   }),
});

export type RegisterUserInput = Omit<
  TypeOf<typeof createCategorySchema>,
  "body.passwordConfirmation"
>;
