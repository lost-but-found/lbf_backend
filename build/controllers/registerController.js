"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const path_1 = __importDefault(require("path"));
const bcrypt = require("bcrypt");
const handleNewUser = async (req, res) => {
    const { fullName, email, pwd, phoneNumber } = req.body;
    if (!email || !pwd || !fullName || !phoneNumber)
        return res.status(400).json({ message: "Please fill in all details" });
    // check for duplicate usernames in the db
    const duplicateEmail = await User_1.default.findOne({ email }).exec();
    if (duplicateEmail)
        return res
            .status(409)
            .send({ error: "Email already registered by another user." });
    const duplicateNumber = await User_1.default.findOne({ phoneNumber }).exec();
    if (duplicateNumber)
        return res
            .status(409)
            .send({ error: "Phone number already registered by another user." });
    // Function to create random OTP code
    const generateOTP = () => {
        const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
        return code;
    };
    const profileImg = req.file?.path;
    /* Normalize the image path using path module. Without this, Windows will make use of
    backward slashes which is not readable by web systems and other OSs */
    const normalizedProfileImagePath = profileImg?.split(path_1.default.sep).join("/");
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        let OTP = generateOTP();
        //create and store the new user
        const result = await User_1.default.create({
            fullName,
            email,
            password: hashedPwd,
            phoneNumber,
            photo: normalizedProfileImagePath,
            tempOTP: {
                timeStamp: Date.now(),
                OTP: OTP,
            },
        });
        console.log(result);
        const msg = {
            to: email,
            from: "lostbutfounditemsapp@gmail.com",
            subject: "LostButFound Verification Code",
            text: `Your OTP code is ${OTP}`,
        };
        await mail_1.default.send(msg);
        console.log(`OTP sent to ${email}`);
        res.status(201).json({ success: `New user created!`, userId: result._id });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.handleNewUser = handleNewUser;
//# sourceMappingURL=registerController.js.map