import { PaymentStatus } from "./../payment/payment.type";
import ItemModel, { IItem } from "./item.model";
import { CategoryModel } from "../category";
import { UserModel, UserService } from "../user";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { EventEmitter, EventEmitterEvents } from "../../events";
import { PipelineStage } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ItemLikeModel, ItemLikeService } from "../itemLike";
import itemLikeService from "../itemLike/itemLike.service";
import { ItemCommentModel } from "../itemComment";
import { PaymentService } from "../payment";

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
                  _id: 1,
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
          $lookup: {
            from: "likes", // Assuming your likes collection is named "likes"
            localField: "_id", // Assuming item's ID field is "_id"
            foreignField: "item", // Assuming likes are associated with items
            as: "userLikes",
          },
        },
        {
          $lookup: {
            from: "comments", // Replace with your comments collection name
            localField: "_id",
            foreignField: "item", // Assuming comments are associated with items
            as: "comments",
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
            isClosed: 1,
            isBookmarked: { $in: ["$_id", "$currentUserDetails.bookmarked"] },
            likeCount: { $size: "$userLikes" }, // Count the likes
            isLiked: {
              $cond: {
                if: {
                  $in: ["$currentUserDetails._id", "$userLikes.user"],
                },
                then: true,
                else: false,
              },
            },
            commentCount: { $size: "$comments" }, // Count the comments
          },
        },
      ];
      // console.log({ aggregationPipeline });
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
        date: new Date(date),
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
      const item = await ItemModel.findById(itemId)
        .select("-searchText")
        .exec();

      return item;
    } catch (error) {
      throw new Error("Failed to retrieve item.");
    }
  }

  async getItemWithStats(itemId: string, userId: string) {
    try {
      const [item, user, payment] = await Promise.all([
        ItemModel.findById(itemId).select("-searchText").exec(),
        UserService.getUser(userId),
        PaymentService.verifyPayment({
          itemId,
          userId,
          status: PaymentStatus.COMPLETED,
        }),
      ]);
      if (!item) {
        throw new Error("Item not found.");
      }

      if (!user) {
        throw new Error("Item not found.");
      }

      // Retrieve likes count, check if the user has liked the item, and retrieve comments count concurrently
      const [likeCount, isLiked, commentCount] = await Promise.all([
        ItemLikeModel.countDocuments({ item: itemId }),
        ItemLikeModel.exists({ item: itemId, user: userId }),
        ItemCommentModel.countDocuments({ item: itemId }),
      ]);

      // Check if the current user has bookmarked the item
      const isBookmarked = user ? user.bookmarked.includes(itemId) : false;

      // Add likeCount, isLiked, and commentCount to the item object
      const itemWithStats = {
        ...item.toObject(),
        likeCount,
        isLiked: isLiked ? true : false,
        isPaid: !!payment ? true : false,
        commentCount,
        isBookmarked,
      };

      return itemWithStats;
    } catch (error) {
      throw new Error("Failed to retrieve item.");
    }
  }

  async getItemLocations() {
    const locations = await ItemModel.distinct("location").exec();
    return locations;
  }

  async claimItem(userId: string, itemId: string) {
    try {
      const user = await UserModel.findById(userId);
      const item = await ItemModel.findById(itemId);

      if (!user || !item) {
        return {
          message: "User or item not found.",
          status: StatusCodes.NOT_FOUND,
        };
      }

      // Check if the item is already claimed by the user
      if (item.claimedBy.includes(userId)) {
        return {
          message: "Item is already claimed by the user.",
          status: StatusCodes.CONFLICT,
        };
      }

      // Mark the item as claimed by the user
      item.claimedBy.push(userId);
      await item.save();
      EventEmitter.emit(EventEmitterEvents.ITEM_CLAIMED, {
        itemId,
        userId: item.poster?.toString(),
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

  async updateItemStatus(userId: string, itemId: string, isClosed: boolean) {
    try {
      const user = await UserService.getUser(userId);
      const item = await ItemModel.findOne({
        _id: itemId,
        poster: userId,
      });

      if (!user || !item) {
        return {
          message: "User or item not found.",
          status: StatusCodes.NOT_FOUND,
        };
      }

      item.isClosed = isClosed;
      await item.save();

      return {
        message: `Item status changed to ${
          isClosed ? "closed" : "open"
        } successfully.`,
        status: StatusCodes.CREATED,
      };
    } catch (error) {
      throw new Error("Failed to like item.");
    }
  }

  async likeItem(userId: string, itemId: string) {
    try {
      const user = await UserService.getUser(userId);
      const item = await ItemModel.findById(itemId);

      if (!user || !item) {
        return {
          message: "User or item not found.",
          status: StatusCodes.NOT_FOUND,
        };
      }

      EventEmitter.emit(EventEmitterEvents.ITEM_LIKED, {
        itemId,
        userId: item.poster?.toString(),
      });
      // Check if the user has already liked the item
      const existingLike = await ItemLikeService.likeItem(userId, itemId);

      if (existingLike) {
        return {
          message: "User has already liked the item.",
          status: StatusCodes.CONFLICT,
        };
      }
      console.log("time to emit");

      return {
        message: "Item liked successfully.",
        status: StatusCodes.CREATED,
      };
    } catch (error) {
      throw new Error("Failed to like item.");
    }
  }

  async getLikedItems(userId: string) {
    try {
      // Find likes associated with the user
      const userLikes = await ItemLikeService.getLikedItems(userId);
      return userLikes;
    } catch (error) {
      throw new Error("Failed to fetch liked items.");
    }
  }

  async unlikeItem(userId: string, itemId: string) {
    try {
      // Find the like associated with the user and item
      const like = await itemLikeService.unlikeItem(userId, itemId);

      if (!like) {
        throw new Error("Item not found");
      }

      return "Item unliked successfully.";
    } catch (error) {
      throw new Error("Failed to unlike item.");
    }
  }

  async deleteItem(itemId: string, userId: string) {
    try {
      const deletedItem = await ItemModel.findOneAndDelete({
        _id: itemId,
        poster: userId,
      });
      if (!deletedItem) throw Error("Failed to delete");
      console.log({ deletedItem });
      return {
        message: "Item deleted successfully.",
      };
    } catch (error) {
      throw new Error("Failed to delete item.");
    }
  }
}

export default new ItemService();
