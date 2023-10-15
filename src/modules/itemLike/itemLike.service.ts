import { LikeModel } from "./itemLike.model";
import { CategoryModel } from "../category";
import { UserModel, UserService } from "../user";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { EventEmitter, EventEmitterEvents } from "../../events";
import { PipelineStage } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ILike } from "./itemLike.type";

class ItemLikeService {
  async likeItem(userId: string, itemId: string) {
    try {
      // const user = await UserModel.findById(userId);
      // const item = await ItemModel.findById(itemId);

      // if (!user || !item) {
      //   return {
      //     message: "User or item not found.",
      //     status: StatusCodes.NOT_FOUND,
      //   };
      // }

      // Check if the user has already liked the item
      const existingLike = await LikeModel.findOne({
        user: userId,
        item: itemId,
      });

      if (existingLike) {
        return {
          message: "User has already liked the item.",
          status: StatusCodes.CONFLICT,
        };
      }

      // Create a new like and associate it with the item
      const like = new LikeModel({ user: userId, item: itemId });
      await like.save();

      return {
        message: "Item liked successfully.",
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new Error("Failed to like item.");
    }
  }

  async getLikedItems(userId: string) {
    try {
      // Find likes associated with the user
      const userLikes = await LikeModel.find({ user: userId }).select("item");

      // Extract the item IDs from userLikes
      const itemIds = userLikes.map((like: ILike) => like.item);

      return itemIds;
    } catch (error) {
      throw new Error("Failed to retrieve liked items.");
    }
  }

  async unlikeItem(userId: string, itemId: string) {
    try {
      // Find the like associated with the user and item
      const like = await LikeModel.findOneAndRemove({
        user: userId,
        item: itemId,
      });
      console.log({ like, userId, itemId });
      if (!like) {
        return {
          message: "User has not liked the item.",
          status: StatusCodes.NOT_FOUND,
        };
      }

      return {
        message: "Item unliked successfully.",
        status: StatusCodes.OK,
      };
    } catch (error) {
      throw new Error("Failed to unlike item.");
    }
  }
}

export default new ItemLikeService();
