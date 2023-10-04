import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import ItemService from "./item.service";
import buildDateQuery from "../../utils/buildDateQuery";
import mongoose from "mongoose";
import { BooleanString } from "./item.type";

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
      const item = await ItemService.getItemWithBookmarkStatus(
        itemId,
        req.userId
      );

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
}

export default new ItemController();
