import express, { Router } from "express";
import { handleAllFoundItems } from "../../controllers/itemsController";

const router: Router = express.Router();

router.get("/", handleAllFoundItems);

export default router;
