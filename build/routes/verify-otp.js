"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyOTPController_1 = require("../controllers/verifyOTPController");
const router = express_1.default.Router();
router.post("/", verifyOTPController_1.verifyOTPFunc);
exports.default = router;
//# sourceMappingURL=verify-otp.js.map