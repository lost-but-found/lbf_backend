import { isValidObjectId } from "mongoose";
import { ItemTypeEnum } from "./../item.type";
import { any, nativeEnum, array, object, string, TypeOf } from "zod";

enum BooleanString {
  TRUE = "true",
  FALSE = "false",
}
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

    // type: nativeEnum(ItemTypeEnum, {
    //   required_error: "Type is required",
    // }),

    isFound: nativeEnum(BooleanString, {
      required_error: "isFound is required",
    }),
    date: string().optional(),
    time: string().optional(),
    additional_description: string()
      .min(2, "Additional Description is too short - should be 2 chars minimum")
      .optional(),
  }),
  files: array(any())
    .min(1, "At least one file is required")
    .max(4, "Maximum of four images allowed"),
});

export type RegisterUserInput = TypeOf<typeof createItemSchema>;
