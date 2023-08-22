import express, { Router } from "express";
import { getItem, handleAllItems } from "./item.controller";

const ItemRouter: Router = express.Router();

ItemRouter.get("/", handleAllItems);
ItemRouter.get("/me", handleAllItems);

ItemRouter.route("/:id").get(getItem);

export default ItemRouter;
