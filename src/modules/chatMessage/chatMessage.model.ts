import { Schema, Document, model, Types } from "mongoose";
import { IUser } from "../user";
import { IChatRoom } from "../chatRoom/chatRoom.model";

export enum MessageStatus {
  UNREAD = "unread",
  READ = "read",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
}

interface IChatMessage extends Document {
  content: string;
  sender: Types.ObjectId | IUser;
  chatRoom: Types.ObjectId | IChatRoom;
  status: MessageStatus;
  type: MessageType;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  replyTo?: Types.ObjectId;
}

const chatMessageSchema = new Schema<IChatMessage>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatRoom: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(MessageStatus),
    default: MessageStatus.UNREAD,
  },
  type: {
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "ChatMessage",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const ChatMessageModel = model<IChatMessage>("ChatMessage", chatMessageSchema);

export { ChatMessageModel, IChatMessage };
