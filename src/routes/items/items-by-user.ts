const express = require("express");
const router = express.Router();
const itemsController = require("../../controllers/itemsController");

router.get("/users/:username/items", itemsController.getItemsByUser);

module.exports = router;
