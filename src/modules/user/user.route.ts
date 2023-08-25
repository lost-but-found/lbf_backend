import express, { Router } from "express";
import UserController from "./user.controller";
import { isAuth } from "../auth/auth.middleware";

const UserRouter: Router = express.Router();

UserRouter.get("/", isAuth, UserController.getAllUsers);

UserRouter.get("/bookmark/:id", isAuth, UserController.bookmarkItem);
UserRouter.get("/:id", isAuth, UserController.getUser);

export default UserRouter;
