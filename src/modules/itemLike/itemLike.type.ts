import { Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId;
  item: Types.ObjectId;
}
