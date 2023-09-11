import { UserModel } from ".";
import { ItemModel } from "../item";
import { IItem } from "../item/item.model";
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

  async bookmarkItem(userId: string, itemId: string): Promise<IItem | null> {
    try {
      const [user, item] = await Promise.all([
        User.findById(userId),
        ItemModel.findById(itemId),
      ]);
      if (!user || !item) {
        return null;
        // throw new Error("User or item not found.");
      }

      // Check if the item is already bookmarked by the user
      if (user.bookmarked.includes(itemId)) {
        throw new Error("Item already bookmarked.");
      }

      user.bookmarked.push(itemId);
      await user.save();
      return item;
    } catch (error) {
      throw new Error("Failed to bookmark item.");
    }
  }

  async unbookmarkItem(userId: string, itemId: string): Promise<IItem | null> {
    try {
      const [user, item] = await Promise.all([
        User.findById(userId),
        ItemModel.findById(itemId),
      ]);
      if (!user || !item) {
        return null;
      }

      // Check if the item is bookmarked by the user
      if (!user.bookmarked.includes(itemId)) {
        throw new Error("Item not bookmarked.");
      }

      user.bookmarked = user.bookmarked.filter(
        (id) => id.toString() !== itemId
      );
      console.log({ book: user.bookmarked });
      await user.save();
      return item;
    } catch (error) {
      throw new Error("Failed to unbookmark item.");
    }
  }

  async getBookmarkedItems(userId: string, type?: string) {
    try {
      const user = await User.findById(userId).populate<{
        bookmarked: IItem[];
      }>("bookmarked");

      if (!user) {
        throw new Error("User not found.");
      }

      const bookmarkedItems = user.bookmarked.filter((item) => {
        if (typeof item === "string") {
          return true;
        }
        if (type) {
          return item.type === type;
        }
        return true;
      });

      return bookmarkedItems;
    } catch (error) {
      throw new Error("Failed to retrieve bookmarked items.");
    }
  }

  async getUsers(page = 1, pageSize = 10, query = {}) {
    try {
      const skip = (page - 1) * pageSize;
      const [users, totalUsersCount] = await Promise.all([
        UserModel.find(query)
          .sort({ createdAt: -1 })
          .select("-password") // Exclude the password field
          .skip(skip)
          .limit(pageSize)
          .exec(),
        UserModel.countDocuments(query),
      ]);

      return {
        users,
        totalUsersCount,
      };
    } catch (error) {
      throw new Error("Failed to retrieve users.");
    }
  }

  async getUser(userId: string) {
    try {
      const user = await User.findById(userId).select("-password").exec();
      return user;
    } catch (error) {
      throw new Error("Failed to retrieve user.");
    }
  }

  async updateOnlineStatus(userId: string, isOnline: boolean) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }
      if (user.isOnline === isOnline) {
        return;
      }

      if (!isOnline) {
        user.lastSeen = new Date();
        user.isOnline = false;
      } else {
        user.isOnline = true;
      }
      await user.save();
    } catch (error) {
      throw new Error("Failed to update online status.");
    }
  }

  async getUserDeviceTokens(userId: string): Promise<string> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }

      return user?.deviceToken ?? "";
    } catch (error) {
      throw new Error("Failed to update online status.");
    }
  }
}

export default new UserService();
