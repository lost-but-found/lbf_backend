import { Schema, Document, model, Types } from "mongoose";
import { ItemTypeEnum } from "./item.type";

interface IItem extends Document {
  name: string;
  description?: string;
  type: ItemTypeEnum;
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
}

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  itemImg: {
    type: String,
  },
  otherImgs: [{ type: String }],
  category: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  type: {
    type: String,
    // Use ItemTypeEnum as the enum values
    enum: Object.values(ItemTypeEnum),
    default: "lost",
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
  extraInfo: {
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
  // An array of users who have tried to claim this item
  claimedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default model<IItem>("Item", itemSchema);
