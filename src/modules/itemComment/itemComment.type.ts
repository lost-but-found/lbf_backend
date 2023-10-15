import { Document, Types } from "mongoose";

export interface IComment extends Document {
  text: string;
  item: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}
