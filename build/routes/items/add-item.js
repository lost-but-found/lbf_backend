"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemsController_1 = require("../../controllers/itemsController");
const upload = require("../../middleware/multer");
const router = express_1.default.Router();
router.post("/", upload.array("itemImgs", 9), itemsController_1.addItem);
exports.default = router;
//# sourceMappingURL=add-item.js.map