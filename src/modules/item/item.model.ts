import { Schema, Document, model, Types } from "mongoose";

interface IItem extends Document {
  title: string;
  description?: string;
  missing: boolean;
  category: string;
  itemImg?: string;
  dateRegistered?: string;
  timeFound?: string;
  otherImgs?: string[];
  location?: string;
  bookmarked?: Boolean;
  extraInfo?: string;
  createdAt?: Date;
  userId?: string | Types.ObjectId;
}

const itemSchema = new Schema<IItem>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  missing: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: true,
  },
  itemImg: {
    type: String,
  },
  otherImgs: [{ type: String }],
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateRegistered: {
    type: String,
  },
  timeFound: {
    type: String,
  },
  bookmarked: {
    type: Boolean,
  },
  extraInfo: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<IItem>("Item", itemSchema);
