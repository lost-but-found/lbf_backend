"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPFunc = void 0;
require("dotenv").config();
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Verify OTP code
const verifyOTP = (input, OTP) => {
    return input === OTP; // Returns TRUE if equal
};
// Checks to see if the inputed OTP is valid
const verifyOTPFunc = async (req, res) => {
    const currentTime = Date.now();
    const { inputedOTP, email } = req.body;
    const twoMinutesAgo = currentTime - 120000; // 2 minutes = 120,000 milliseconds
    const userWithOTP = await User_1.default.find({
        email: email,
        "tempOTP.timeStamp": { $gt: twoMinutesAgo },
        "tempOTP.OTP": inputedOTP,
    }).exec();
    console.log(userWithOTP);
    // Extract the OTP
    const extractedOTP = userWithOTP.length > 0 ? Number(userWithOTP[0].tempOTP.OTP) : null;
    console.log(typeof extractedOTP);
    try {
        if (!extractedOTP) {
            res.status(404).send({ error: "not found" });
        }
        else if (Number(inputedOTP) === extractedOTP) {
            userWithOTP[0].verified = true;
            await userWithOTP[0].save();
            const payload = {
                UserInfo: {
                    _id: userWithOTP[0]._id,
                    email: userWithOTP[0].email,
                },
            };
            // Sign the access token
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "5d", // Access token expires in 1 day
            });
            // Return the access token to the user
            return res.send({
                message: "OTP code is valid. Email verification complete.",
                accessToken,
            });
        }
        else if (inputedOTP !== extractedOTP) {
            res.status(400).send({
                error: "OTP code is invalid or expired. Kindly request another.",
            });
        }
        else if (!userWithOTP) {
            res.status(404).send({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(500).send({ error: "Failed to verify OTP code" });
    }
};
exports.verifyOTPFunc = verifyOTPFunc;
//# sourceMappingURL=verifyOTPController.js.map