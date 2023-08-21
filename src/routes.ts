import express from "express";
import path from "path";
import { Application, Router } from "express";
import { AuthRouter } from "./modules/auth";
import { CategoryRouter } from "./modules/category";
import { ItemRouter } from "./modules/item";
import { UserRouter } from "./modules/user";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/category", CategoryRouter);
router.use("/item", ItemRouter);
router.use("/user", UserRouter);

const routes = (app: Application) => {
  app.use("/api/v1", router);
  app.use("/item-image", express.static(path.join(__dirname, "..", "tmp")));

  // Serve static files from the 'Profile Images' directory
  app.use(
    "/profile-image",
    express.static(path.join(__dirname, "profile-image"))
  );
};

export default routes;
