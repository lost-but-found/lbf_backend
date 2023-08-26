import { Schema, Document, model, Types } from "mongoose";
import { IUser } from "../user";

interface IChatRoom extends Document {
  users: string[];
  createdAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoomModel = model<IChatRoom>("ChatRoom", chatRoomSchema);

export { ChatRoomModel, IChatRoom };
export default ChatRoomModel;
