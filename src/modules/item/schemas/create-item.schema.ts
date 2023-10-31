import { BooleanString } from "./../item.type";
import { any, nativeEnum, array, object, string, TypeOf, boolean } from "zod";

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
  files: array(any()).length(4, "Must be four images"),
});

export const updateItemStatusSchema = object({
  body: object({
    isClosed: boolean({
      required_error: "Text is required",
    }),
  }),
});

export type CreateItemInput = TypeOf<typeof createItemSchema>;
