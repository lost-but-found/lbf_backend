import FCM from "../../utils/fcm";
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

  async markNotificationAsRead({
    userId,
    notificationId,
    isRead,
  }: {
    userId: Types.ObjectId;
    notificationId: Types.ObjectId;
    isRead: boolean;
  }): Promise<INotification | null> {
    try {
      const updatedNotification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead },
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

  async getNotification(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId
  ): Promise<INotification | null> {
    try {
      const notification = await NotificationModel.findOne({
        user: userId,
        _id: notificationId,
      });
      return notification;
    } catch (error) {
      throw new Error("Failed to fetch notifications for user.");
    }
  }

  async sendPushNotification(
    title: string,
    body: string,
    userDeviceToken: string,
    user: string,
    type?: string,
    meta?: any
  ) {
    const notification = await NotificationModel.create({
      title,
      content: body,
      user,
      type,
      meta,
    });
    FCM.sendPushNotificationToUser(userDeviceToken, title, body);
  }

  async sendGlobalPushNotification(
    title: string,
    body: string,
    userDeviceTokens: string[],
    user: string
  ) {
    const notification = await NotificationModel.create({
      title,
      content: body,
      user,
      isForEveryone: true,
    });
    // FCM.sendPushNotificationToGeneral(title, body);
  }
}

export default new NotificationService();
