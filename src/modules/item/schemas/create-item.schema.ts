import { isValidObjectId } from "mongoose";
import { ItemTypeEnum } from "./../item.type";
import { any, nativeEnum, object, string, TypeOf } from "zod";

export const createItemSchema = object({
  body: object({
    name: string({
      required_error: "Item Name is required",
    }),
    description: string()
      .min(10, "Description is too short - should be 10 chars minimum")
      .optional(),
    category: string({
      required_error: "Category is required",
    }),
    photos: string().optional(),
    location: string().optional(),

    type: nativeEnum(ItemTypeEnum, {
      required_error: "Type is required",
    }),
    date: string().optional(),
    time: string().optional(),
    additional_description: string()
      .min(2, "Additional Description is too short - should be 2 chars minimum")
      .optional(),
    // Check if category is a valid mogoose object id
  }).refine((data) => isValidObjectId(data.category), {
    message: "Category is not a valid id",
    path: ["category"],
  }),
});

export type RegisterUserInput = TypeOf<typeof createItemSchema>;
