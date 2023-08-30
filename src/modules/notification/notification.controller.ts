import { Request, Response } from "express";
import NotificationService from "./notification.service";
import { Types } from "mongoose";

class NotificationController {
  createNotification = async (req: Request, res: Response) => {
    try {
      const { title, content, type, user } = req.body;
      const newNotification = await NotificationService.createNotification({
        title,
        content,
        type,
        user,
      });
      return res.status(201).json(newNotification);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create notification." });
    }
  };

  markNotificationAsRead = async (req: Request, res: Response) => {
    try {
      const notificationId = req.params.id;
      const updatedNotification =
        await NotificationService.markNotificationAsRead(
          new Types.ObjectId(notificationId)
        );
      return res.status(200).json(updatedNotification);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to mark notification as clicked." });
    }
  };

  getUserNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const notifications = await NotificationService.getUserNotifications(
        new Types.ObjectId(userId)
      );
      return res.status(200).json(notifications);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch notifications for user." });
    }
  };
}

export default new NotificationController();
