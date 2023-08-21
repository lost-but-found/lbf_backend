import express, { Router } from "express";
import {
  getAllCategories,
  addCategory,
} from "../../controllers/categoryController";

const CategoryRouter: Router = express.Router();

CategoryRouter.route("/").get(getAllCategories).post(addCategory);

export default CategoryRouter;
