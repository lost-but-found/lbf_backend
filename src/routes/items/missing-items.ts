import express, { Router } from "express";
import { handleAllMissingItems } from "../../controllers/itemsController";
const upload = require("../../middleware/multer");

const router: Router = express.Router();

router.get("/", handleAllMissingItems);

export default router;
