import express, { Router } from "express";
import UserController from "./user.controller";
import { isAuth } from "../auth/auth.middleware";

const UserRouter: Router = express.Router();

UserRouter.get("/", isAuth, UserController.getUsers);

UserRouter.get("/bookmarks", isAuth, UserController.getBookmarkedItems);
UserRouter.post("/bookmarks/:id", isAuth, UserController.bookmarkItem);
UserRouter.delete("/bookmarks/:id", isAuth, UserController.unbookmarkItem);
UserRouter.get("/profile", isAuth, UserController.getProfile);
UserRouter.get("/:id", isAuth, UserController.getUser);

export default UserRouter;
