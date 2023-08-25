import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import CategoryService from "./category.service";

class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const allCategories = await CategoryService.getAllCategories();

      return sendResponse({
        res,
        status: StatusCodes.OK,
        message: "All categories fetched successfully.",
        data: allCategories,
        success: true,
      });
    } catch (err) {
      console.error(err);
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to fetch categories.",
        success: false,
      });
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,
          message: "Category name is required.",
          success: false,
        });
      }

      const newCategory = await CategoryService.addCategory(name, description);

      return sendResponse({
        res,
        status: StatusCodes.CREATED,
        message: "Category created successfully.",
        data: newCategory,
        success: true,
      });
    } catch (err) {
      console.error(err);
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create category.",
        success: false,
      });
    }
  }
}

export default new CategoryController();
