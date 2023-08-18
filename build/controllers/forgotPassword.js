"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const User_1 = __importDefault(require("../models/User"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const resendOTPController_1 = require("./resendOTPController");
const bcrypt = require("bcrypt");
const resetPassword = async (req, res) => {
    const { email, phoneNumber } = req.body;
    let user;
    if (email) {
        user = await User_1.default.findOne({ email });
    }
    else if (phoneNumber) {
        user = await User_1.default.findOne({ phoneNumber });
    }
    else {
        return res.status(400).send({ error: "Invalid request" });
    }
    if (!user) {
        res
            .status(404)
            .send({ error: "No user registered with that email or phone number" });
    }
    const token = (0, resendOTPController_1.generateOTP)();
    const sendToken = async (email, token) => {
        const msg = {
            to: email,
            from: "lostbutfounditemsapp@gmail.com",
            subject: "Reset Your Password",
            text: `Your Password reset code is: ${token}`,
        };
        try {
            await mail_1.default.send(msg);
            console.log(`Token sent to ${email}`);
        }
        catch (error) {
            console.error(error + "Error!");
            throw new Error("Failed to send OTP code");
        }
    };
    try {
        await sendToken(user.email, token);
        // Store the generated token in the user model
        user.resetToken = token;
        await user.save();
        res.status(200).send({ message: "Password reset code sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=forgotPassword.js.map