import ItemModel from "./item.model";

// Externals
import { UserModel } from "../user";
import { CategoryModel } from "../category";

import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { sendResponse } from "../../utils/sendResponse";

const handleAllItems = async (req, res) => {
  const allItems = await ItemModel.find();
  return sendResponse({
    res,
    message: "All items retrieved!",
    data: allItems,
    success: true,
  });
};

const handleAllMissingItems = async (req, res) => {
  try {
    const missingItems = await ItemModel.find({ missing: true });
    res.json(missingItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleAllFoundItems = async (req, res) => {
  try {
    const foundItems = await ItemModel.find({ missing: false });
    res.status(200).json(foundItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addItem = async (req, res) => {
  const { title, desc, missing, category, location, extraInfo, date, time } =
    req.body;
  const userId = req.userId;

  // const itemImgs: string[] = req.files?.map((file) => file.path);

  const itemImgs = req.files?.map((file) => file.buffer) || [];

  // console.log(itemImgs);

  try {
    const itemImg = itemImgs[0]; // Extract the first image for itemImg
    if (!itemImg) return console.log("No item image fam");

    const otherImgs = itemImgs; //rest of thte image urls

    // Upload the main itemImg to Cloudinary
    const itemImgUrl = await uploadImageToCloudinary(itemImg);

    // Upload otherImgs to Cloudinary
    const otherImgUrls = await Promise.all(
      otherImgs.map(uploadImageToCloudinary)
    );

    // const otherImgUrls = await Promise.all(
    //   itemImgs.map(uploadImageToCloudinary)
    // );

    const result = await ItemModel.create({
      title,
      description: desc,
      missing,
      dateRegistered: date,
      timeFound: time,
      category,
      location,
      itemImg: itemImgUrl,
      otherImgs: otherImgUrls,
      extraInfo,
      userId,
    });
    const duplicateCategory = await CategoryModel.findOne({ name: category });

    if (!duplicateCategory) {
      await CategoryModel.create({
        name: category,
      });
    }
    res.status(201).send({ message: "Item added!", userId });
    console.log(result);
  } catch (error) {
    res.status(500).send({ error: error });
    console.log(error);
  }
};

const getItem = async (req, res) => {
  const itemId = req.params.id;
  const item = await ItemModel.findById(itemId);

  if (item) {
    res.status(200).json(item);
  }
};

const bookmarkItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  const item = await ItemModel.findById(itemId);

  if (item) {
    user.bookmarked.push(itemId);
    await user.save();

    console.log(user);
    res.status(200).send({ message: "Item bookmarked!" });
  } else res.status(404).send({ error: "Item not found" });
};

const updateItem = async (req, res) => {};

const getItemsByUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const items = await ItemModel.find({ user: user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const ItemController = {
  handleAllItems,
  getItem,
  handleAllFoundItems,
  handleAllMissingItems,
  bookmarkItem,
  addItem,
  getItemsByUser,
};

export {
  handleAllItems,
  getItem,
  handleAllFoundItems,
  handleAllMissingItems,
  bookmarkItem,
  addItem,
  getItemsByUser,
};
export default ItemController;
