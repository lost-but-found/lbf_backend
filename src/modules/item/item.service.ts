import ItemModel from "./item.model";
import { CategoryModel } from "../category";
import { UserModel, UserService } from "../user";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { EventEmitter, EventEmitterEvents } from "../../events";
import { PipelineStage } from "mongoose";

class ItemService {
  async getItems2(query: any, page: number, limit: number) {
    try {
      const skipCount = page * limit;
      const [items, totalItemsCount] = await Promise.all([
        ItemModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limit),
        ItemModel.countDocuments(query),
      ]);
      // const bookmarks = await UserService.getBookmarkedItems()
      return {
        items,
        totalItemsCount,
        // bookmarks:
      };
    } catch (error) {
      throw new Error("Failed to retrieve items.");
    }
  }
  async getItems(userId: string, query: any, page: number, limit: number) {
    try {
      console.log({ page, limit });
      const skipCount = Math.max(page - 1, 0) * limit;

      // Aggregate to fetch items and user's bookmarked items
      const aggregationPipeline2: PipelineStage[] = [
        {
          $match: query, // Apply your query conditions
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skipCount,
        },
        {
          $limit: limit,
        },
        {
          $addFields: {
            // Convert 'currentUserId' to ObjectId type
            currentUserIdObjectId: { $toObjectId: userId },
          },
        },
        {
          $lookup: {
            from: "users", // Replace with the actual name of the User collection
            localField: "currentUserIdObjectId", // Use the converted currentUserIdObjectId
            foreignField: "_id",
            as: "currentUserDetails",
          },
        },
        {
          $addFields: {
            // Use $arrayElemAt to extract the first (and only) element of the 'currentUserDetails' array
            currentUserDetails: { $arrayElemAt: ["$currentUserDetails", 0] },
          },
        },
        {
          $project: {
            _id: 1, // Include other item fields as needed
            name: 1,
            description: 1,
            category: 1,
            // type: 1,
            isFound: 1,
            date: 1,
            time: 1,
            location: 1,
            additional_description: 1,
            createdAt: 1,
            poster: 1,
            claimedBy: 1,
            // Include only the 'bookmarked' field from 'currentUserDetails'
            isBookmarked: {
              $in: ["$_id", "$currentUserDetails.bookmarked"],
            },
          },
        },
      ];

      const aggregationPipeline: PipelineStage[] = [
        {
          $match: query,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skipCount,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "users",
            let: { userId: { $toObjectId: userId } },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$userId"] } },
              },
              {
                $project: {
                  _id: 0,
                  bookmarked: 1,
                },
              },
            ],
            as: "currentUserDetails",
          },
        },
        {
          $set: {
            currentUserDetails: { $arrayElemAt: ["$currentUserDetails", 0] },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            category: 1,
            isFound: 1,
            date: 1,
            time: 1,
            images: 1,
            location: 1,
            additional_description: 1,
            createdAt: 1,
            poster: 1,
            claimedBy: 1,
            isBookmarked: { $in: ["$_id", "$currentUserDetails.bookmarked"] },
          },
        },
      ];

      const items = await ItemModel.aggregate(aggregationPipeline);

      const totalItemsCount = items.length;

      return {
        items,
        totalItemsCount,
      };
    } catch (error) {
      console.log({ error });
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
          .select("-searchText")
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
  async searchItems2(searchQuery: string, page: number, limit: number) {
    try {
      const skipCount = page * limit;
      const regex = new RegExp(searchQuery, "i"); // Case-insensitive search

      const [items, totalItemsCount] = await Promise.all([
        ItemModel.find({
          $or: [
            {
              $text: {
                $search: searchQuery,
              },
            },
            {
              searchText: {
                $regex: regex, // Use the regular expression pattern for wildcard search
              },
            },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limit),
        ItemModel.countDocuments({
          $or: [{ name: regex }, { description: regex }],
        }),
      ]);

      return {
        items,
        totalItemsCount,
      };
    } catch (error) {
      throw new Error("Failed to search items.");
    }
  }

  async addItem(data: any, userId: string) {
    try {
      const {
        name,
        description,
        // type,
        isFound,
        category,
        location,
        additional_description,
        date,
        time,
        itemImgs,
      } = data;

      const imgUrls = await Promise.all(itemImgs.map(uploadImageToCloudinary));

      // Concatenate relevant fields' values for the searchText field
      const searchText = [
        name,
        description,
        category,
        location,
        additional_description,
      ].join(" ");

      const result = await ItemModel.create({
        name,
        description,
        // type,
        isFound: isFound.trim() === "true",
        date,
        time,
        category,
        location,
        images: imgUrls,
        additional_description,
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
      return await ItemModel.findById(itemId).select("-searchText").exec();
    } catch (error) {
      throw new Error("Failed to retrieve item.");
    }
  }

  async getItemLocations() {
    const locations = await ItemModel.distinct("location").exec();
    return locations;
  }

  async getItemWithBookmarkStatus(itemId: string, currentUser: string) {
    try {
      const [item, user] = await Promise.all([
        ItemModel.findById(itemId).select("-searchText").exec(),
        UserService.getUser(currentUser),
      ]);

      if (!item) {
        throw new Error("Item not found.");
      }

      // Check if the current user has bookmarked the item
      const isBookmarked = user ? user.bookmarked.includes(itemId) : false;

      // Add the isBookmarked property to the item
      const itemWithBookmarkStatus = {
        ...item.toObject(),
        isBookmarked,
      };

      return itemWithBookmarkStatus;
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
      EventEmitter.emit(EventEmitterEvents.ItemClaimed, {
        userId: item.poster,
      });
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
