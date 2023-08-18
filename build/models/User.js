"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photo: String,
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    personalID: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    bookmarked: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    verified: Boolean,
    tempOTP: {
        timeStamp: Number,
        OTP: String,
    },
    refreshToken: String,
});
// module.exports = mongoose.model("User", userSchema);
exports.default = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.js.map