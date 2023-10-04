import express from "express";
import NotificationController from "./notification.controller";
import { isAuth } from "../auth/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import { createNotificationSchema } from "./schemas/create-notification.schema";

const router = express.Router();

router.get("/", isAuth, NotificationController.getUserNotifications);
router.post(
  "/",
  validateRequest(createNotificationSchema),
  isAuth,
  NotificationController.createNotification
);
router.get("/:id", isAuth, NotificationController.getSingleNotification);

router.patch(
  "/:id/:status",
  isAuth,
  NotificationController.markNotificationAsRead
);

router.delete("/:id/delete", isAuth, NotificationController.deleteNotification);

export default router;
