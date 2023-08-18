"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User_1.default.find();
        res.send(allUsers);
    }
    catch (error) {
        res.send({ error });
    }
};
exports.getAllUsers = getAllUsers;
const updateUser = async (req, res) => {
    const { email, phoneNumber } = req.body;
    const profileImg = req.file?.path;
    /* Normalize the image path using path module. Without this, Windows will make use of
    backward slashes which is not readable by web systems and other OSs */
    const normalizedProfileImagePath = profileImg.split(path_1.default.sep).join("/");
    try {
        const userId = req.userId;
        const user = await User_1.default.findById(userId);
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.photo = normalizedProfileImagePath;
        await user.save();
    }
    catch (error) {
        console.log("An error occured:", error);
    }
};
exports.updateUser = updateUser;
const getUser = async (req, res) => {
    const { id } = req.params;
    if (id) {
        try {
            const user = await User_1.default.findById(id);
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).send({ error: "An error occured" });
            console.log(err);
        }
    }
    else {
        res.status(404).send({ error: "User not found." });
    }
};
exports.getUser = getUser;
//# sourceMappingURL=usersController.js.map