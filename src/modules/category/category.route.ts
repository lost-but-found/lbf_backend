import express, { Router } from "express";
import CategoryController from "./category.controller";
import validateRequest from "../../middleware/validateRequest";
import { createCategorySchema } from "./schemas/create-category.schema";
import { isAuth } from "../auth/auth.middleware";

const CategoryRouter: Router = express.Router();

CategoryRouter.post(
  "/",
  isAuth,
  validateRequest(createCategorySchema),
  CategoryController.addCategory
);
CategoryRouter.get("/", isAuth, CategoryController.getAllCategories);

export default CategoryRouter;
