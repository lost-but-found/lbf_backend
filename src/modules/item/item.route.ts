import express, { Router } from "express";
import ItemController from "./item.controller";
import validateRequest from "../../middleware/validateRequest";
import { createItemSchema } from "./schemas/create-item.schema";
import upload from "../../middleware/upload";

const ItemRouter: Router = express.Router();

ItemRouter.get("/", ItemController.handleAllItems);
ItemRouter.post(
  "/",
  upload.array("photos"),
  validateRequest(createItemSchema),
  ItemController.addItem
);
ItemRouter.get("/me", ItemController.handleAllItems);

ItemRouter.get("/:id", ItemController.getItem);

export default ItemRouter;
