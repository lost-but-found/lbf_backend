"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path_1 = __importDefault(require("path"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const verifyJWT_1 = __importDefault(require("./middleware/verifyJWT"));
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
/* Sendgrid implementation */
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const PORT = process.env.PORT || 3500;
// Connect to MongoDB
connectDB();
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// Routes imports
const add_item_1 = __importDefault(require("./routes/items/add-item"));
const missing_items_1 = __importDefault(require("./routes/items/missing-items"));
const found_items_1 = __importDefault(require("./routes/items/found-items"));
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const all_items_1 = __importDefault(require("./routes/items/all-items"));
const resend_otp_1 = __importDefault(require("./routes/resend-otp"));
const verify_otp_1 = __importDefault(require("./routes/verify-otp"));
const category_1 = __importDefault(require("./routes/categories/category"));
const bookmark_item_1 = __importDefault(require("./routes/items/bookmark-item"));
const user_1 = __importDefault(require("./routes/users/user"));
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger"); // Import the Swagger specification
/* Middleware for swagger UI */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// Serve static files from the 'Images' directory
// app.use(
//   "/item-image",
//   express.static(path.join(__dirname, "..", "item-image"))
// );
app.use("/item-image", express.static(path_1.default.join(__dirname, "..", "tmp")));
// Serve static files from the 'Profile Images' directory
app.use("/profile-image", express.static(path_1.default.join(__dirname, "profile-image")));
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
app.use("/register", register_1.default);
app.use("/login", login_1.default);
app.use("/items", all_items_1.default);
app.use("/resend-otp", resend_otp_1.default);
app.use("/verify-otp", verify_otp_1.default);
app.use("/refresh", require("./routes/refresh"));
app.use("/categories", category_1.default);
app.use("/users", user_1.default);
app.use("/missing-items", missing_items_1.default);
app.use("/found-items", found_items_1.default);
app.use(verifyJWT_1.default);
app.use("/add-item", add_item_1.default);
app.use("/bookmark", bookmark_item_1.default);
app.use("/items-by-user", require("./routes/items/items-by-user"));
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
//# sourceMappingURL=index.js.map