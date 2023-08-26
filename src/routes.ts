import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { Application, Router } from "express";
import { AuthRouter } from "./modules/auth";
import { CategoryRouter } from "./modules/category";
import { ItemRouter } from "./modules/item";
import { UserRouter } from "./modules/user";
import { sendResponse } from "./utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ChatMessageRouter } from "./modules/chatMessage";
import { ChatRoomRouter } from "./modules/chatRoom";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/category", CategoryRouter);
router.use("/items", ItemRouter);
router.use("/users", UserRouter);
router.use("/chat-messages", ChatMessageRouter);
router.use("/chats", ChatRoomRouter);

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
    sendResponse({
      res,
      status: StatusCodes.NOT_FOUND,
      message: "Sorry, page not found!",
      success: false,
    });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      sendResponse({
        res,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message,
        success: false,
        // error: err,
      });
      next();
    }
  });
};

export default routes;
