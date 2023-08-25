import Category from "./category.model";

class CategoryService {
  async getAllCategories() {
    try {
      return await Category.find();
    } catch (err) {
      throw new Error("Failed to fetch categories.");
    }
  }

  async addCategory(name: string, description: string) {
    try {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new Error("Category name already exists.");
      }

      const newCategory = new Category({ name, description });
      return await newCategory.save();
    } catch (err) {
      throw new Error("Failed to create category.");
    }
  }
}

export default new CategoryService();
