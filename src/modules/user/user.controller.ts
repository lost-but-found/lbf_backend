import User from "./user.model";
import { Request, Response } from "express";
import path from "path";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import UserService from "./user.service";

class UserController {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const allUsers = await User.find();
      res.send(allUsers);
    } catch (error) {
      res.send({ error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const { email, phone } = req.body;

    const profileImg: string = req.file?.path ?? "";

    /* Normalize the image path using path module. Without this, Windows will make use of
  backward slashes which is not readable by web systems and other OSs */
    const normalizedProfileImagePath = profileImg.split(path.sep).join("/");

    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
        return sendResponse({
          res,
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "User not found",
        });
      }
      user.email = email;
      user.phone = phone;
      user.photo = normalizedProfileImagePath;
      await user.save();
    } catch (error) {
      console.log("An error occured:", error);
    }
  };

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id) {
      try {
        const user = await User.findById(id);
        res.status(200).json(user);
      } catch (err) {
        res.status(500).send({ error: "An error occured" });
        console.log(err);
      }
    } else {
      res.status(404).send({ error: "User not found." });
    }
  };

  async bookmarkItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const userId = req.userId;

      const bookmarkedItem = await UserService.bookmarkItem(userId, itemId);

      if (!bookmarkedItem) {
        return sendResponse({
          res,
          status: StatusCodes.OK,
          message: "Item unbookmarked!",
          success: true,
        });
      }

      return sendResponse({
        res,
        status: StatusCodes.OK,
        message: "Item bookmarked!",
        success: true,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Failed to bookmark item.",
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
}

export default new UserController();
