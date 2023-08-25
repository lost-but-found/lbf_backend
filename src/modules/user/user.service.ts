import { ItemModel } from "../item";
import User from "./user.model";

class UserService {
  findUserByEmailOrPhone = async ({
    email,
    phone,
  }: {
    email: string;
    phone: string;
  }) => {
    try {
      const user = await User.findOne({
        $or: [{ email }, { phone }],
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  async bookmarkItem(userId: string, itemId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      const item = await ItemModel.findById(itemId);

      if (!user || !item) {
        throw new Error("User or item not found.");
      }

      // Check if the item is already bookmarked by the user
      if (user.bookmarked.includes(itemId)) {
        user.bookmarked = user.bookmarked.filter(
          (bookmarkedItemId) => bookmarkedItemId !== itemId
        );
        await user.save();
        return false;
      }

      user.bookmarked.push(itemId);
      await user.save();
      return true;
    } catch (error) {
      throw new Error("Failed to bookmark item.");
    }
  }

  async getBookmarkedItems(userId: string, type?: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      const query: {
        type?: string;
      } = {};

      if (type) {
        query.type = type;
      }

      const bookmarkedItems = await ItemModel.find(query);

      return bookmarkedItems;
    } catch (error) {
      throw new Error("Failed to retrieve bookmarked items.");
    }
  }
}

export default new UserService();
