import express, { Router } from "express";
import { getAllUsers, getUser } from "../../controllers/usersController";

const router: Router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUser);

export default router;
