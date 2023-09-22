import { isValidObjectId } from "mongoose";
import { any, nativeEnum, array, object, string, TypeOf } from "zod";

export const updateUserSchema = object({
  body: object({
    name: string().optional(),
    // email: string().optional(),
    phone: string().optional(),
    // phone: string().optional(),
    // password: string().optional(),
  }),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
