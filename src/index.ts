require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
import path from "path";

import sgMail from "@sendgrid/mail";

import verifyJWT from "./middleware/verifyJWT";
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

/* Sendgrid implementation */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Routes imports
import addItemRouter from "./routes/items/add-item";
import missingItemsRouter from "./routes/items/missing-items";
import foundItemsRouter from "./routes/items/found-items";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import allItemsRouter from "./routes/items/all-items";
import resendOTPRouter from "./routes/resend-otp";
import verifyOTPRouter from "./routes/verify-otp";
import categoryRouter from "./routes/categories/category";
import bookmarkRouter from "./routes/items/bookmark-item";
import usersRouter from "./routes/users/user";

const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger"); // Import the Swagger specification

/* Middleware for swagger UI */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Serve static files from the 'Images' directory
// app.use(
//   "/item-image",
//   express.static(path.join(__dirname, "..", "item-image"))
// );

app.use("/item-image", express.static(path.join(__dirname, "..", "tmp")));

// Serve static files from the 'Profile Images' directory
app.use(
  "/profile-image",
  express.static(path.join(__dirname, "profile-image"))
);

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});

// routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/items", allItemsRouter);
app.use("/resend-otp", resendOTPRouter);
app.use("/verify-otp", verifyOTPRouter);
app.use("/refresh", require("./routes/refresh"));
app.use("/categories", categoryRouter);
app.use("/users", usersRouter);
app.use("/missing-items", missingItemsRouter);
app.use("/found-items", foundItemsRouter);

app.use(verifyJWT);
app.use("/add-item", addItemRouter);
app.use("/bookmark", bookmarkRouter);
app.use("/items-by-user", require("./routes/items/items-by-user"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
