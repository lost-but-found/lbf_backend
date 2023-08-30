import ItemModel from "./item.model";
import { CategoryModel } from "../category";
import { UserModel } from "../user";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { EventEmitter, EventEmitterEvents } from "../../events";

class ItemService {
  async getItems(query: any, page: number, limit: number) {
    try {
      const skipCount = page * limit;
      const [items, totalItemsCount] = await Promise.all([
        ItemModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limit),
        ItemModel.countDocuments(query),
      ]);

      return {
        items,
        totalItemsCount,
      };
    } catch (error) {
      throw new Error("Failed to retrieve items.");
    }
  }
  async searchItems(searchQuery: string, page: number, limit: number) {
    try {
      const skipCount = page * limit;

      // Create a MongoDB text search query object
      const textSearchQuery = {
        $text: {
          $search: searchQuery,
        },
      };

      const [items, totalItemsCount] = await Promise.all([
        ItemModel.find(textSearchQuery)
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limit),
        ItemModel.countDocuments(textSearchQuery),
      ]);

      return {
        items,
        totalItemsCount,
      };
    } catch (error) {
      throw new Error("Failed to search items.");
    }
  }

  //   Another way to implement searchItems() is to use a regular expression (regex) to perform a case-insensitive search on the name and description fields:
  //   async searchItems(searchQuery: string, page: number, limit: number) {
  //     try {
  //       const skipCount = page * limit;
  //       const regex = new RegExp(searchQuery, "i"); // Case-insensitive search

  //       const [items, totalItemsCount] = await Promise.all([
  //         ItemModel.find({
  //           $or: [{ name: regex }, { description: regex }],
  //         })
  //           .sort({ createdAt: -1 })
  //           .skip(skipCount)
  //           .limit(limit),
  //         ItemModel.countDocuments({
  //           $or: [{ name: regex }, { description: regex }],
  //         }),
  //       ]);

  //       return {
  //         items,
  //         totalItemsCount,
  //       };
  //     } catch (error) {
  //       throw new Error("Failed to search items.");
  //     }
  //   }

  async addItem(data: any, userId: string) {
    try {
      const {
        name,
        description,
        type,
        category,
        location,
        extraInfo,
        date,
        time,
        itemImgs,
      } = data;

      const itemImgUrl = await uploadImageToCloudinary(itemImgs[0]);
      const otherImgUrls = await Promise.all(
        itemImgs.slice(1).map(uploadImageToCloudinary)
      );

      // Concatenate relevant fields' values for the searchText field
      const searchText = [
        name,
        description,
        category,
        location,
        extraInfo,
      ].join(" ");

      const result = await ItemModel.create({
        name,
        description,
        type,
        date,
        time,
        category,
        location,
        itemImg: itemImgUrl,
        otherImgs: otherImgUrls,
        extraInfo,
        poster: userId,
        searchText,
      });

      const duplicateCategory = await CategoryModel.findOne({ name: category });

      if (!duplicateCategory) {
        await CategoryModel.create({
          name: category,
        });
      }

      return result;
    } catch (error) {
      throw new Error("Failed to add item.");
    }
  }

  async getItem(itemId: string) {
    try {
      return await ItemModel.findById(itemId);
    } catch (error) {
      throw new Error("Failed to retrieve item.");
    }
  }

  async claimItem(userId: string, itemId: string) {
    try {
      const user = await UserModel.findById(userId);
      const item = await ItemModel.findById(itemId);

      if (!user || !item) {
        throw new Error("User or item not found.");
      }

      // Check if the item is already claimed by the user
      if (item.claimedBy.includes(userId)) {
        throw new Error("Item is already claimed by the user.");
      }

      // Mark the item as claimed by the user
      item.claimedBy.push(userId);
      await item.save();
      EventEmitter.emit(EventEmitterEvents.ItemClaimed, item.poster);
    } catch (error) {
      throw new Error("Failed to claim item.");
    }
  }

  async getClaimedItems(userId: string, type?: string) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      const query: {
        claimedBy: string;
        type?: string;
      } = {
        claimedBy: userId,
      };

      // const query: {
      //   claimedBy: string;
      //   type?: string;
      // } = {
      //   claimedBy: { $in: user.bookmarked },
      // };

      if (type) {
        query.type = type;
      }

      const claimedItems = await ItemModel.find(query);

      return claimedItems;
    } catch (error) {
      throw new Error("Failed to retrieve claimed items.");
    }
  }
}

export default new ItemService();
