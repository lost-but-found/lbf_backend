import express, { Router } from "express";
import UserController from "./user.controller";
import { isAuth } from "../auth/auth.middleware";
import upload from "../../middleware/upload";
import { updateUserSchema } from "./schemas/update-user.schema";
import validateRequest from "../../middleware/validateRequest";

const UserRouter: Router = express.Router();

UserRouter.get("/", isAuth, UserController.getUsers);
UserRouter.post(
  "/update",
  upload.single("photo"),
  validateRequest(updateUserSchema),
  isAuth,
  UserController.updateUser
);

UserRouter.get("/bookmarks", isAuth, UserController.getBookmarkedItems);
UserRouter.post("/bookmarks/:id", isAuth, UserController.bookmarkItem);
UserRouter.delete("/bookmarks/:id", isAuth, UserController.unbookmarkItem);
UserRouter.get("/profile", isAuth, UserController.getProfile);
UserRouter.get("/:id", isAuth, UserController.getUser);

export default UserRouter;
