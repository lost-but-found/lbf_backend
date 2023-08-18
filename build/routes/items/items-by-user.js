"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const itemsController = require("../../controllers/itemsController");
router.get("/users/:username/items", itemsController.getItemsByUser);
module.exports = router;
//# sourceMappingURL=items-by-user.js.map