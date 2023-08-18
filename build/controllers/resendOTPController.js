"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPToUser = exports.generateOTP = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const User_1 = __importDefault(require("../models/User"));
// Function to create random OTP code
const generateOTP = () => {
    const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
    return code;
};
exports.generateOTP = generateOTP;
const sendOTP = async (email, OTP) => {
    const msg = {
        to: email,
        from: "lostbutfounditemsapp@gmail.com",
        subject: "Verify your email",
        text: `Your OTP code is ${OTP}`,
    };
    try {
        await mail_1.default.send(msg);
        console.log(`OTP sent to ${email}`);
    }
    catch (error) {
        console.error(error + "Error!");
        throw new Error("Failed to send OTP code");
    }
};
const sendOTPToUser = async (req, res) => {
    const { email } = req.body;
    let OTP = (0, exports.generateOTP)();
    try {
        sendOTP(email, OTP);
        //Update OTP of user
        const updatedUserOTP = await User_1.default.findOneAndUpdate({ email }, {
            $set: {
                "tempOTP.OTP": String(OTP),
                "tempOTP.timeStamp": Date.now(),
            },
        }, { new: true });
        console.log(updatedUserOTP);
        console.log(OTP);
        // return OTP;
        res.send({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to send OTP code" });
    }
};
exports.sendOTPToUser = sendOTPToUser;
//# sourceMappingURL=resendOTPController.js.map