import {
  Schema,
  Document,
  model,
  Types,
  SchemaDefinition,
  Model,
} from "mongoose";
import { ILike } from "./itemLike.type";

const likeSchema = new Schema<ILike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
},  {
  timestamps: true,
},);

export const LikeModel: Model<ILike> = model("Like", likeSchema);
