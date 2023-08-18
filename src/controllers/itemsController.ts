import Item from "../models/Item";
import User from "../models/User";
import Category from "../models/Category";

const { uploadImageToCloudinary } = require("../config/cloudinary");

const handleAllItems = async (req, res) => {
  const allItems = await Item.find();
  res.status(200).send(allItems);
};

const handleAllMissingItems = async (req, res) => {
  try {
    const missingItems = await Item.find({ missing: true });
    res.json(missingItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleAllFoundItems = async (req, res) => {
  try {
    const foundItems = await Item.find({ missing: false });
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

    const result = await Item.create({
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
    const duplicateCategory = await Category.findOne({ name: category });

    if (!duplicateCategory) {
      await Category.create({
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
  const item = await Item.findById(itemId);

  if (item) {
    res.status(200).json(item);
  }
};

const bookmarkItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.userId;

  const user = await User.findById(userId);
  const item = await Item.findById(itemId);

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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const items = await Item.find({ user: user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
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
