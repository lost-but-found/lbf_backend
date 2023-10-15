import {
  Schema,
  Document,
  model,
  Types,
  SchemaDefinition,
  Model,
} from "mongoose";
import { IComment } from "./itemComment.type";

const commentSchema = new Schema<IComment>({
  text: {
    type: String,
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const CommentModel: Model<IComment> = model("Comment", commentSchema);
