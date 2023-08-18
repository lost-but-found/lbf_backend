import User from "../models/User";
import { Request, Response } from "express";
import path from "path";
import Item from "../models/Item";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (error) {
    res.send({ error });
  }
};

const updateUser = async (req, res) => {
  const { email, phoneNumber } = req.body;

  const profileImg: string | undefined = req.file?.path;

  /* Normalize the image path using path module. Without this, Windows will make use of
  backward slashes which is not readable by web systems and other OSs */
  const normalizedProfileImagePath = profileImg.split(path.sep).join("/");

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    user.email = email;
    user.phoneNumber = phoneNumber;
    user.photo = normalizedProfileImagePath;
    await user.save();
  } catch (error) {
    console.log("An error occured:", error);
  }
};

const getUser = async (req, res) => {
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

export { getAllUsers, getUser, updateUser };
