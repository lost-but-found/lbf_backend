import { NotificationModel, INotification } from "./notification.model";
import { Types } from "mongoose";

class NotificationService {
  async createNotification(
    notificationData: Partial<INotification>
  ): Promise<INotification> {
    try {
      const newNotification = await NotificationModel.create(notificationData);
      return newNotification;
    } catch (error) {
      throw new Error("Failed to create notification.");
    }
  }

  async markNotificationAsRead(
    notificationId: Types.ObjectId
  ): Promise<INotification | null> {
    try {
      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
      return updatedNotification;
    } catch (error) {
      throw new Error("Failed to mark notification as clicked.");
    }
  }

  async getUserNotifications(userId: Types.ObjectId): Promise<INotification[]> {
    try {
      const notifications = await NotificationModel.find({ user: userId }).sort(
        { createdAt: -1 }
      );
      return notifications;
    } catch (error) {
      throw new Error("Failed to fetch notifications for user.");
    }
  }
}

export default new NotificationService();
