import express from "express";
import NotificationController from "./notification.controller";

const router = express.Router();

router.post("/", NotificationController.createNotification);
router.patch("/:id/clicked", NotificationController.markNotificationAsRead);
router.get("/users/:userId", NotificationController.getUserNotifications);

export default router;
