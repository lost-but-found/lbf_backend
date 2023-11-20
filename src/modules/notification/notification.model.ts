import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  title: string;
  content?: string;
  isRead: boolean;
  isForEveryone: boolean;
  type: string;
  user: Types.ObjectId;
  updated_at: Date;
  created_at: Date;
  meta?: any; // Additional data for handling the action
  link?: string; // URL or identifier of the related resource
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    title: { type: String, required: true },
    content: String,
    isRead: { type: Boolean, default: false },
    isForEveryone: { type: Boolean, default: false },
    type: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    meta: Schema.Types.Mixed,
    link: String,
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export { NotificationModel };
