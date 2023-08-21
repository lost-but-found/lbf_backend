import express, { Request, Response } from "express";
import path from "path";
import { Application, Router } from "express";
import { AuthRouter } from "./modules/auth";
import { CategoryRouter } from "./modules/category";
import { ItemRouter } from "./modules/item";
import { UserRouter } from "./modules/user";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/category", CategoryRouter);
router.use("/items", ItemRouter);
router.use("/users", UserRouter);

const routes = (app: Application) => {
  app.use("/api/v1", router);
  app.use("/item-image", express.static(path.join(__dirname, "..", "tmp")));

  // Serve static files from the 'Profile Images' directory
  app.use(
    "/profile-image",
    express.static(path.join(__dirname, "profile-image"))
  );

  // Error handler for 404 - Page Not Found
  app.use((req: Request, res: Response, next) => {
    console.log("---- 404 error handler", req.originalUrl);
    res.status(404).json({ message: "Sorry, page not found!" });
  });

  app.use((err, req, res, next) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      next();
    }
  });
};

export default routes;
