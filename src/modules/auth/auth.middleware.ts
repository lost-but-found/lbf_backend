import allowedOrigins from "../../config/allowedOrigins";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET_KEY } from "../../config";

// Extend the Request interface to include the user property when the middleware is used
declare global {
  namespace Express {
    interface Request {
      user?: string; // Attach the User type to the user property
      userId?: string;
    }
  }
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: any =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
    // res.send({ message: "No header found!" });
  }

  const token: string = authHeader.split(" ")[1];
  jwt.verify(
    token,
    JWT_SECRET_KEY,
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(403).send({ error: "Access token expired or invalid" });
        console.log(err);
      }

      req.user = decoded.user.email;
      req.userId = decoded.user._id;

      next();
    }
  );
};

const isWhitelisted = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin ?? "";
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export { isWhitelisted, isAuth };
