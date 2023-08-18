"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt = require("bcrypt");
const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.userId;
    if (userId) {
        try {
            const user = await User_1.default.findById(userId);
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        res.status(400).send({ message: "Account not found" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=resetPasswordController.js.map