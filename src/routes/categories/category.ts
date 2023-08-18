import express, { Router } from "express";
import {
  getAllCategories,
  addCategory,
} from "../../controllers/categoryController";

const router: Router = express.Router();

router.route("/").get(getAllCategories).post(addCategory);

export default router;
