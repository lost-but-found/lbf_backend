import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import corsOptions from "./config/corsOptions";
import sgMail from "@sendgrid/mail";
import cookieParser from "cookie-parser";
import connectToDatabase from "./utils/connectToDatabase";
import routes from "./routes";
import { isWhitelisted } from "./modules/auth/auth.middleware";
import { PORT } from "./config";

/* Sendgrid implementation */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

app.listen(PORT, () => {
  // Connect to MongoDB
  connectToDatabase(() => {});
  routes(app);
  console.log(`Server running on port ${PORT}`);
});
