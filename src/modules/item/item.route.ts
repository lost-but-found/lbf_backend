import express, { Router } from "express";
import ItemController from "./item.controller";
import validateRequest from "../../middleware/validateRequest";
import { createItemSchema } from "./schemas/create-item.schema";
import upload from "../../middleware/upload";
import { isAuth } from "../auth/auth.middleware";
import { createItemCommentSchema } from "../itemComment/schemas/create-item-comment.schema";

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

ItemRouter.post(
  "/comments/:id",
  isAuth,
  validateRequest(createItemCommentSchema),
  ItemController.createItemComment
);
ItemRouter.get("/comments/:id", isAuth, ItemController.getItemComments);
ItemRouter.delete(
  "/comments/:commentId",
  isAuth,
  ItemController.deleteItemComment
);

ItemRouter.get("/:id", isAuth, ItemController.getItem);
ItemRouter.post("/:id/claim", isAuth, ItemController.claimItem);
ItemRouter.post("/:id/unclaim", isAuth, ItemController.claimItem);
ItemRouter.post("/:id/like", isAuth, ItemController.likeItem);
ItemRouter.post("/:id/unlike", isAuth, ItemController.unlikeItem);

export default ItemRouter;
