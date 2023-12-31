import allowedOrigins from "../../config/allowedOrigins";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service";

// Extend the Request interface to include the user property when the middleware is used
declare global {
  namespace Express {
    interface Request {
      user: string; // Attach the User type to the user property
      userId: string;
    }
  }
}

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: any =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse({
      res,
      status: StatusCodes.UNAUTHORIZED,
      message: "Access token required",
      success: false,
    });
  }

  const token: string = authHeader.split(" ")[1];
  const decoded = await AuthService.verifyAuthToken(token);
  console.log({ decoded });
  if (!decoded) {
    return sendResponse({
      res,
      status: StatusCodes.UNAUTHORIZED,
      message: "Invalid access token",
      success: false,
    });
  }

  req.user = decoded.user.email;
  req.userId = decoded.user._id;
  next();
};

const isWhitelisted = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin ?? "";
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export { isWhitelisted, isAuth };
