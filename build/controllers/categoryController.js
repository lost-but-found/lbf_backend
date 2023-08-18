"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategory = exports.getAllCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const getAllCategories = async (req, res) => {
    const allCategories = await Category_1.default.find({});
    res.status(200).send.json(allCategories);
};
exports.getAllCategories = getAllCategories;
// Route for adding a category
const addCategory = async (req, res) => {
    try {
        // Extract the required fields from the request body
        const { name, description } = req.body;
        // Perform any necessary validation on the data
        if (!name) {
            return res.status(400).json({ error: "Category name is required." });
        }
        // Create a new Category instance
        const newCategory = new Category_1.default({ name, description });
        // Save the category to the database
        await newCategory.save();
        // Check if the category name already exists
        const existingCategory = await Category_1.default.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category name already exists." });
        }
        // Return a success response
        return res.status(201).json({
            message: "Category created successfully.",
            category: newCategory,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create the category." });
    }
};
exports.addCategory = addCategory;
//# sourceMappingURL=categoryController.js.map