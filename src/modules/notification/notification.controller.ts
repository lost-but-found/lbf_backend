import { Request, Response } from "express";
import NotificationService from "./notification.service";
import { Types } from "mongoose";
import { sendResponse } from "../../utils/sendResponse";

class NotificationController {
  createNotification = async (req: Request, res: Response) => {
    try {
      const { title, content, type } = req.body;
      const user = req.userId;
      const newNotification = await NotificationService.createNotification({
        title,
        content,
        type,
        user: new Types.ObjectId(user),
      });
      return res.status(201).json(newNotification);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create notification." });
    }
  };

  markNotificationAsRead = async (req: Request, res: Response) => {
    try {
      const notificationId = req.params.id;
      const notificationStatus = req.params.status;
      const userId = req.userId;
      const updatedNotification =
        await NotificationService.markNotificationAsRead({
          userId: new Types.ObjectId(userId),
          notificationId: new Types.ObjectId(notificationId),
          isRead: notificationStatus.trim().toLowerCase() === "read",
        });
      return res.status(200).json(updatedNotification);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to mark notification as clicked." });
    }
  };

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const notificationId = req.params.id;
      const userId = req.userId;

      return res.status(200).json({
        hhhm: "ddmo",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to mark notification as clicked." });
    }
  };

  getUserNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const notifications = await NotificationService.getUserNotifications(
        new Types.ObjectId(userId)
      );
      return sendResponse({
        res,
        status: 200,
        message: "Notifications fetched successfully.",
        success: true,
        data: notifications,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch notifications for user." });
    }
  };

  getSingleNotification = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const notificationId = req.params.id;
      const notification = await NotificationService.getNotification(
        new Types.ObjectId(userId),
        new Types.ObjectId(notificationId)
      );
      return sendResponse({
        res,
        status: 200,
        message: "Notifications fetched successfully.",
        success: true,
        data: notification,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch notifications for user." });
    }
  };
}

export default new NotificationController();
