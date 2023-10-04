import express, { Router } from "express";
import ItemController from "./item.controller";
import validateRequest from "../../middleware/validateRequest";
import { createItemSchema } from "./schemas/create-item.schema";
import upload from "../../middleware/upload";
import { isAuth } from "../auth/auth.middleware";

const ItemRouter: Router = express.Router();

ItemRouter.get("/", isAuth, ItemController.getItems);
ItemRouter.post(
  "/",
  isAuth,
  upload.array("photos"),
  validateRequest(createItemSchema),
  ItemController.addItem
);
ItemRouter.get("/search", isAuth, ItemController.searchItems);
ItemRouter.get("/locations", isAuth, ItemController.getItemLocations);
ItemRouter.get("/me", isAuth, ItemController.getItems);

ItemRouter.get("/:id", isAuth, ItemController.getItem);
ItemRouter.post("/:id/claim", isAuth, ItemController.claimItem);
ItemRouter.post("/:id/unclaim", isAuth, ItemController.claimItem);

export default ItemRouter;
