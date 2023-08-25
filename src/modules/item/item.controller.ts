import ItemModel from "./item.model";
import { Request, Response } from "express";

// Externals
import { UserModel } from "../user";
import { CategoryModel } from "../category";

import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { sendResponse } from "../../utils/sendResponse";

const buildQuery = (query: any) => {
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

const getItems = async (req: Request, res: Response) => {
  try {
    // Check for any query parameters (category, location, date_from, date_to, type, page, limit)
    const { category, location, date_from, date_to, type, poster } = req.query;
    const { page, limit } = req.query;

    // Create a query object
    let query: any = {};

    // Add the query parameters to the query object
    if (category) query.category = category;
    if (location) query.location = location;
    if (type) query.type = type;
    if (poster) query.poster = poster;

    // Add the date query parameters to the query object
    query = { ...query, ...buildQuery(req.query) };

    const pageAsNumber = parseInt((page ?? "0") as string);
    const limitAsNumber = parseInt((limit ?? "10") as string);

    const skipCount = pageAsNumber * limitAsNumber;

    const [items, totalItemsCount] = await Promise.all([
      ItemModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limitAsNumber),
      ItemModel.countDocuments(query),
    ]);

    return sendResponse({
      res,
      message: "All items retrieved!",
      data: {
        items,
        page: pageAsNumber,
        limit: limitAsNumber,
        total: totalItemsCount,
        hasMore: items.length < totalItemsCount,
      },
      success: true,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      message: "Failed to retrieve items!",
      error: error,
      success: false,
    });
  }
};

const addItem = async (req: Request, res: Response) => {
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
        name,
        description,
        type,
        date,
        time,
        category,
        location,
        itemImg: itemImgUrl,
        otherImgs: otherImgUrls,
        extraInfo,
        poster,
      });
      const duplicateCategory = await CategoryModel.findOne({ name: category });

      if (!duplicateCategory) {
        await CategoryModel.create({
          name: category,
        });
      }
      sendResponse({
        res,
        message: "Item added!",
        data: result,
        success: true,
      });
      console.log(result);
    } catch (error: any) {
      // res.status(500).send({ error: error });
      sendResponse({
        res,
        message: "Item not added!",
        error: error,
        success: false,
      });
      console.log(error);
    }
  } catch (error: any) {
    sendResponse({
      res,
      message: "Item not added!",
      error: error,
      success: false,
    });
    console.log(error);
  }
};

const getItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const item = await ItemModel.findById(itemId);

    if (item) {
      sendResponse({
        res,
        message: "Item retrieved!",
        data: item,
        success: true,
      });
    }
  } catch (error: any) {
    sendResponse({
      res,
      message: "Item not retrieved!",
      error: error,
      success: false,
    });
    console.log(error);
  }
};

const bookmarkItem = async (req: Request, res: Response) => {
  const itemId = req.params.id;
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    return sendResponse({
      res,
      status: 404,
      success: false,
      message: "User not found",
    });
  }
  const item = await ItemModel.findById(itemId);
  if (!item) {
    return sendResponse({
      res,
      status: 404,
      success: false,
      message: "Item not found",
    });
  }
  if (item) {
    user.bookmarked.push(itemId);
    await user.save();

    console.log(user);
    res.status(200).send({ message: "Item bookmarked!" });
  } else res.status(404).send({ error: "Item not found" });
};

const updateItem = async (req: Request, res: Response) => {};

const ItemController = {
  getItems,
  getItem,
  bookmarkItem,
  addItem,
  // getItemsByUser,
};

export default ItemController;
