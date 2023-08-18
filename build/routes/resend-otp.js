"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resendOTPController_1 = require("../controllers/resendOTPController");
const router = express_1.default.Router();
router.post("/", resendOTPController_1.sendOTPToUser);
exports.default = router;
//# sourceMappingURL=resend-otp.js.map