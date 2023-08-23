import User from "./user.model";
import { Request, Response } from "express";
import path from "path";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (error) {
    res.send({ error });
  }
};

const updateUser = async (req: Request, res: Response) => {
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

const getUser = async (req: Request, res: Response) => {
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

const UserController = { getAllUsers, getUser, updateUser };
export { getAllUsers, getUser, updateUser };
export default UserController;
