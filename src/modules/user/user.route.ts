import express, { Router } from "express";
import { getAllUsers, getUser } from "./user.controller";

const UserRouter: Router = express.Router();

UserRouter.get("/", getAllUsers);

UserRouter.get("/:id", getUser);

export default UserRouter;
