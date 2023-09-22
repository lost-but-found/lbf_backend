import User from "./user.model";
import { Request, Response } from "express";
import path from "path";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import UserService from "./user.service";

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const { page, limit, query } = req.query as {
        page?: number;
        limit?: number;
        query?: Record<string, any>;
      };

      const result = await UserService.getUsers(page, limit, query);

      return sendResponse({
        res,
        message: "Users retrieved successfully.",
        data: {
          users: result.users,
          page,
          limit,
          total: result.totalUsersCount,
          hasMore: result.users.length < result.totalUsersCount,
        },
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve users.",
        error: error.message,
        success: false,
      });
    }
  }
  updateUser = async (req: Request, res: Response) => {
    const { name, phone } = req.body;
    let photoBuffer: Buffer | undefined = undefined;
    if (req.file) {
      photoBuffer = req.file?.buffer;
    }

    try {
      const userId = req.userId;
      const user = await UserService.updateUserDetails(userId, {
        name,
        phone,
        photoBuffer,
      });
      if (!user) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "User not found",
        });
      }

      return sendResponse({
        res,
        status: StatusCodes.OK,
        success: true,
        message: "User data updated",
        data: user,
      });
    } catch (error) {
      console.log("An error occured:", error);
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Could not update User",
      });
    }
  };

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id) {
      try {
        const user = await UserService.getUser(id);
        if (!user) {
          return sendResponse({
            res,
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "User not found",
          });
        }
        return sendResponse({
          res,
          status: StatusCodes.OK,
          success: true,
          message: "User data found",
          data: user,
        });
      } catch (err) {
        console.log(err);
        return sendResponse({
          res,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Could not find User",
        });
      }
    } else {
      return sendResponse({
        res,
        status: StatusCodes.NOT_FOUND,
        success: false,
        message: "User not found",
      });
    }
  };

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const user = await UserService.getUser(userId);
      if (!user) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "User not found",
        });
      }
      return sendResponse({
        res,
        message: "User profile retrieved successfully.",
        data: user,
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve user profile.",
        error: error.message,
        success: false,
      });
    }
  }
  async bookmarkItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const userId = req.userId;

      const bookmarkedItem = await UserService.bookmarkItem(userId, itemId);
      if (!bookmarkedItem) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          message: "Item not found.",
          success: false,
        });
      }
      return sendResponse({
        res,
        status: StatusCodes.OK,
        message: "Item bookmarked!",
        success: true,
      });
    } catch (error: any) {
      console.log({ error });
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message ?? error ?? "Failed to bookmark item.",
        error: error,
        success: false,
      });
    }
  }

  async unbookmarkItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const userId = req.userId;

      const unbookmarkedItem = await UserService.unbookmarkItem(userId, itemId);

      if (!unbookmarkedItem) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          message: "Item not found.",
          success: false,
        });
      }
      return sendResponse({
        res,
        status: StatusCodes.OK,
        message: "Item unbookmarked!",
        success: true,
        data: unbookmarkedItem,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message ?? "Failed to unbookmark item.",
        error: error,
        success: false,
      });
    }
  }

  async getBookmarkedItems(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { type } = req.query as { type?: string };

      const bookmarkedItems = await UserService.getBookmarkedItems(
        userId,
        type
      );

      return sendResponse({
        res,
        message: "Bookmarked items retrieved successfully.",
        data: bookmarkedItems,
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to retrieve bookmarked items.",
        error: error.message,
        success: false,
      });
    }
  }

  async updateOnlineStatus(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { isOnline } = req.body;

      await UserService.updateOnlineStatus(userId, isOnline);

      return sendResponse({
        res,
        message: "Online status updated successfully.",
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to update online status.",
        error: error.message,
        success: false,
      });
    }
  }
}

export default new UserController();
