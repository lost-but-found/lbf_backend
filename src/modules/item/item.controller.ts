import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import ItemService from "./item.service";
import buildDateQuery from "../../utils/buildDateQuery";
import mongoose from "mongoose";
import { BooleanString } from "./item.type";
import { ItemCommentService } from "../itemComment";

class ItemController {
  async getItems(req: Request, res: Response) {
    try {
      const {
        category,
        location,
        date_from,
        date_to,
        // type,
        isFound,
        isClosed,
        poster,
        search,
      } = req.query;
      const { page, limit } = req.query;

      let query: any = {};

      if (category) query.category = category;
      if (location)
        query.location = {
          $regex: location,
          $options: "i", // "i" for case-insensitive matching
        };
      // if (type) query.type = type;
      if (search)
        query.searchText = {
          $regex: search?.toString()?.toLowerCase(),
          $options: "i", // "i" for case-insensitive matching
        };

      if (isFound)
        query.isFound = isFound ? isFound === BooleanString.TRUE : undefined;
      if (isClosed)
        query.isClosed = isClosed ? isClosed === BooleanString.TRUE : undefined;
      if (poster)
        query.poster = new mongoose.Types.ObjectId(poster?.toString());
      const dateQuery = buildDateQuery({
        date_from: date_from?.toString(),
        date_to: date_to?.toString(),
      });
      query = {
        ...query,
        ...dateQuery,
      };

      const pageAsNumber = parseInt((page ?? "1") as string);
      const limitAsNumber = parseInt((limit ?? "10") as string);
      console.log({ query });
      const result = await ItemService.getItems(
        req.userId,
        query,
        pageAsNumber,
        limitAsNumber
      );

      return sendResponse({
        res,
        message: "All items retrieved!",
        data: {
          items: result.items,
          page: pageAsNumber,
          limit: limitAsNumber,
          total: result.totalItemsCount,
          hasMore: result.items.length < result.totalItemsCount,
        },
        success: true,
      });
    } catch (error: any) {
      console.log({ error });
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve items!",
        error: error,
        success: false,
      });
    }
  }

  async addItem(req: Request, res: Response) {
    try {
      const poster = req.userId;

      let itemImgs: Buffer[] = [];

      if (req.files) {
        itemImgs = (req.files as Express.Multer.File[]).map(
          (file: Express.Multer.File) => file.buffer
        );
      }

      const data = {
        ...req.body,
        itemImgs,
      };

      const result = await ItemService.addItem(data, poster);

      return sendResponse({
        res,
        status: StatusCodes.CREATED,
        message: "Item created successfully.",
        data: result,
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to create item.",
        error: error,
        success: false,
      });
    }
  }

  async getItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const item = await ItemService.getItemWithStats(itemId, req.userId);

      if (item) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Item retrieved!",
          data: item,
          success: true,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Item not retrieved!",
        error: error,
        success: false,
      });
    }
  }

  async getItemLocations(req: Request, res: Response) {
    try {
      const locations = await ItemService.getItemLocations();

      if (locations) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Locations retrieved!",
          data: locations,
          success: true,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Locations not retrieved!",
        error: error,
        success: false,
      });
    }
  }

  async searchItems(req: Request, res: Response) {
    try {
      const { query, page, limit } = req.query;

      if (!query) {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,
          message: "Search query is required.",
          success: false,
        });
      }

      const pageAsNumber = parseInt((page ?? "0") as string);
      const limitAsNumber = parseInt((limit ?? "10") as string);

      const result = await ItemService.searchItems2(
        query as string,
        pageAsNumber,
        limitAsNumber
      );

      return sendResponse({
        res,
        message: "Search results retrieved!",
        data: {
          items: result.items,
          page: pageAsNumber,
          limit: limitAsNumber,
          total: result.totalItemsCount,
          hasMore: result.items.length < result.totalItemsCount,
        },
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        message: "Failed to search items!",
        error: error,
        success: false,
      });
    }
  }

  async claimItem(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const itemId = req.params.id;

      const claimStatus = await ItemService.claimItem(userId, itemId);

      if (claimStatus) {
        return sendResponse({
          res,
          status: claimStatus.status,
          message: claimStatus.message,

          success: false,
        });
      }

      return sendResponse({
        res,
        message: "Item claimed successfully.",
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error ?? "Failed to claim item.",
        error: error,
        success: false,
      });
    }
  }

  async getClaimedItems(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { type } = req.query;

      const claimedItems = await ItemService.getClaimedItems(
        userId,
        type as string
      );

      return sendResponse({
        res,
        message: "Claimed items retrieved successfully.",
        data: claimedItems,
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve claimed items.",
        error: error.message,
        success: false,
      });
    }
  }

  async updateItemStatus(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const itemId = req.params.id;
      const { isClosed } = req.body;

      const itemStatus = await ItemService.updateItemStatus(
        userId,
        itemId,
        isClosed
      );

      if (itemStatus) {
        return sendResponse({
          res,
          status: StatusCodes.CREATED,

          message: itemStatus?.message,
          success: true,
        });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,

          message: "Failed to change item status.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to change item status.",
        success: false,
      });
    }
  }

  async likeItem(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const itemId = req.params.id;

      const likeStatus = await ItemService.likeItem(userId, itemId);

      if (likeStatus) {
        return sendResponse({
          res,
          status: StatusCodes.CREATED,

          message: "Item liked successfully.",
          success: true,
        });
        // } else {
        //   return sendResponse({
        //     res,
        //               status: StatusCodes.CREATED,

        //     message: "User has already liked the item.",
        //     success: false,
        //   });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,

          message: "Failed to like item.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to like item.",
        success: false,
      });
    }
  }

  async getLikedItems(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const likedItems = await ItemService.getLikedItems(userId);

      return sendResponse({
        res,
        status: StatusCodes.OK,
        message: "Liked items retrieved successfully.",
        data: likedItems,
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to retrieve liked items.",
        success: false,
      });
    }
  }

  async unlikeItem(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const itemId = req.params.id;

      const unlikeStatus = await ItemService.unlikeItem(userId, itemId);

      if (unlikeStatus) {
        return sendResponse({
          res,
          status: StatusCodes.CREATED,
          message: "Item unliked successfully.",
          success: true,
        });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,
          message: "Failed to unlike item.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to unlike item.",
        success: false,
      });
    }
  }

  async getItemComments(req: Request, res: Response) {
    try {
      const itemId = req.params.id;

      const comments = await ItemCommentService.getPaginatedComments(
        itemId,
        1,
        10
      );

      if (comments) {
        // if (comments.status === StatusCodes.OK) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          data: comments,
          message: "Item comments fetched successfully.",
          success: true,
        });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.BAD_REQUEST,
          message: "Failed to fetch item comments.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to fetch item comments.",
        success: false,
      });
    }
  }

  async createItemComment(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const userId = req.userId; // Assuming you have user information in the request

      // Extract the comment data from the request body
      const { text } = req.body;

      // Create the comment using the ItemCommentService
      const comment = await ItemCommentService.createComment(
        itemId,
        userId,
        text
      );

      return sendResponse({
        res,
        status: StatusCodes.CREATED,
        message: "Item comment created successfully.",
        data: comment, // Include the created comment in the response data
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to create item comment.",
        success: false,
      });
    }
  }

  async deleteItemComment(req: Request, res: Response) {
    try {
      const commentId = req.params.commentId; // Assuming you pass the comment ID in the request
      const userId = req.userId; // Assuming you have user information in the request

      // Delete the comment using the ItemCommentService
      const deleteResult = await ItemCommentService.deleteComment(
        commentId,
        userId
      );

      if (deleteResult) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Item comment deleted successfully.",
          success: true,
        });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          message:
            "Item comment not found or you don't have permission to delete it.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to delete item comment.",
        success: false,
      });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id; // Assuming you pass the item ID in the request
      const userId = req.userId; // Assuming you have user information in the request

      // Delete the item using the ItemService
      const deleteResult = await ItemService.deleteItem(itemId, userId);

      if (deleteResult) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Item deleted successfully.",
          success: true,
        });
      } else {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          message: "Item not found or you don't have permission to delete it.",
          success: false,
        });
      }
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to delete item.",
        success: false,
      });
    }
  }
}

export default new ItemController();
