import express, { Router } from "express";
import { getItem, handleAllItems } from "../../controllers/itemsController";

const router: Router = express.Router();

router.get("/", handleAllItems);

router.route("/:id").get(getItem);

export default router;
