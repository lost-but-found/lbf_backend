import { Schema, Document, model, Types } from "mongoose";
import { ItemTypeEnum } from "./item.type";

export interface IItem extends Document {
  name: string;
  description?: string;
  type: ItemTypeEnum;
  isFound: boolean;
  category: string;
  itemImg?: string;
  date?: string;
  time?: string;
  otherImgs?: string[];
  location?: string;
  bookmarked?: Boolean;
  extraInfo?: string;
  createdAt?: Date;
  poster?: string | Types.ObjectId;
  searchText: string;
  claimedBy: string[];
}

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: [{ type: String }],
  category: {
    type: String,

    required: true,
  },
  // type: {
  //   type: String,
  //   // Use ItemTypeEnum as the enum values
  //   enum: Object.values(ItemTypeEnum),
  //   default: "lost",
  // },
  isFound: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  additional_description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  poster: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  searchText: {
    type: String,
    default: "",
  },
  // An array of users who have tried to claim this item
  claimedBy: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

// Define the virtual field 'type'
itemSchema.virtual("type").get(function () {
  return this.isFound ? "found" : "lost";
});

// Ensure the virtual field is included when converting to JSON
itemSchema.set("toJSON", { virtuals: true });

itemSchema.index(
  { name: "text", searchText: "text" },
  {
    weights: {
      name: 2,
      searchText: 1,
    },
  }
);

export default model<IItem>("Item", itemSchema);
