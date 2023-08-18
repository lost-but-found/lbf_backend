import express, { Router } from "express";
import { addItem } from "../../controllers/itemsController";
const upload = require("../../middleware/multer");

const router: Router = express.Router();

router.post("/", upload.array("itemImgs", 9), addItem);

export default router;
