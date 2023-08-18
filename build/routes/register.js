"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = require("../controllers/registerController");
const upload = require("../middleware/multer");
const router = express_1.default.Router();
router.post("/", upload.single("photo"), registerController_1.handleNewUser);
exports.default = router;
//# sourceMappingURL=register.js.map