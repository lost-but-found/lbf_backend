import express, { Router } from "express";
import { bookmarkItem } from "../../controllers/itemsController";

const router: Router = express.Router();

router.put("/:id", bookmarkItem);

export default router;
