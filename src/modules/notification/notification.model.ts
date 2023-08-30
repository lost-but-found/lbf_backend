import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  title: string;
  content: string;
  isRead: boolean;
  type: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  title: String,
  content: String,
  isRead: { type: Boolean, default: false },
  type: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: Date,
  updatedAt: Date,
});

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export { NotificationModel };
