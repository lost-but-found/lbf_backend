import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import ItemService from "./item.service";

class ItemController {
  async getItems(req: Request, res: Response) {
    try {
      const { category, location, date_from, date_to, type, poster } =
        req.query;
      const { page, limit } = req.query;

      let query: any = {};

      if (category) query.category = category;
      if (location) query.location = location;
      if (type) query.type = type;
      if (poster) query.poster = poster;
      query = { ...query, ...this.buildQuery(req.query) };

      const pageAsNumber = parseInt((page ?? "0") as string);
      const limitAsNumber = parseInt((limit ?? "10") as string);

      const result = await ItemService.getItems(
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
      const {
        name,
        description,
        type,
        category,
        location,
        extraInfo,
        date,
        time,
      } = req.body;
      const poster = req.userId;

      let itemImgs: Buffer[] = [];

      if (req.files) {
        itemImgs = (req.files as Express.Multer.File[]).map(
          (file: Express.Multer.File) => file.buffer
        );
      }

      const data = {
        name,
        description,
        type,
        category,
        location,
        extraInfo,
        date,
        time,
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
      const item = await ItemService.getItem(itemId);

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

      const result = await ItemService.searchItems(
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

      await ItemService.claimItem(userId, itemId);

      return sendResponse({
        res,
        message: "Item claimed successfully.",
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to claim item.",
        error: error.message,
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

  buildQuery = (query: any) => {
    const queryObj: any = {};
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => delete query[el]);

    if (query.date_from && query.date_to) {
      queryObj.createdAt = {
        $gte: new Date(query.date_from as string),
        $lte: new Date(query.date_to as string),
      };
    } else if (query.date_from) {
      queryObj.createdAt = {
        $gte: new Date(query.date_from as string),
      };
    } else if (query.date_to) {
      queryObj.createdAt = {
        $lte: new Date(query.date_to as string),
      };
    }

    return queryObj;
  };
}

export default new ItemController();
