import Category from "../models/Category";

const getAllCategories = async (req, res) => {
  const allCategories = await Category.find({});
  res.status(200).send.json(allCategories);
};

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
    const newCategory = new Category({ name, description });

    // Save the category to the database
    await newCategory.save();

    // Check if the category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists." });
    }

    // Return a success response
    return res.status(201).json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create the category." });
  }
};

export { getAllCategories, addCategory };
