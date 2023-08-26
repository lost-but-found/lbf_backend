import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
const app = express();

import cors from "cors";
import corsOptions from "./config/corsOptions";
import sgMail from "@sendgrid/mail";
import cookieParser from "cookie-parser";
import connectToDatabase from "./utils/connectToDatabase";
import routes from "./routes";
import { isWhitelisted } from "./modules/auth/auth.middleware";
import { PORT, SENDGRID_API_KEY } from "./config";
import socketEvents from "./sockets";

/* Sendgrid implementation */
sgMail.setApiKey(SENDGRID_API_KEY);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(isWhitelisted);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Health Check");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // path: "/socket",
  /* options */
});

socketEvents(io);
routes(app);

connectToDatabase(() => {
  console.log(`Running on ${process.env.NODE_ENV} mode`);

  httpServer.listen(PORT);

  console.log(`Server running on port ${PORT}`);
});

export { io };
