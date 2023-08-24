import express, { Router } from "express";
import CategoryController from "./category.controller";
import validateRequest from "../../middleware/validateRequest";
import { createCategorySchema } from "./schemas/create-category.schema";

const CategoryRouter: Router = express.Router();

CategoryRouter.post(
  "/",
  validateRequest(createCategorySchema),
  CategoryController.addCategory
);
CategoryRouter.get("/", CategoryController.getAllCategories);

export default CategoryRouter;
