import { Request, Response } from "express";
import Category from "./category.model";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await Category.find({});

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
};

// Route for adding a category
const addCategory = async (req: Request, res: Response) => {
  try {
    // Extract the required fields from the request body
    const { name, description } = req.body;

    // Perform any necessary validation on the data
    if (!name) {
      return sendResponse({
        res,
        status: StatusCodes.BAD_REQUEST,
        message: "Category name is required.",
        success: false,
      });
    }

    // Create a new Category instance
    const newCategory = new Category({ name, description });

    // Save the category to the database
    await newCategory.save();

    // Check if the category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return sendResponse({
        res,
        status: StatusCodes.BAD_REQUEST,
        message: "Category name already exists.",
        success: false,
      });
    }

    // Return a success response
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
};

const CategoryController = {
  getAllCategories,
  addCategory,
};

export { getAllCategories, addCategory };
export default CategoryController;
