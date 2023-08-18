"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    missing: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        required: true,
    },
    itemImg: {
        type: String,
    },
    otherImgs: [{ type: String }],
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dateRegistered: {
        type: String,
    },
    timeFound: {
        type: String,
    },
    bookmarked: {
        type: Boolean,
    },
    extraInfo: {
        type: String,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
});
exports.default = (0, mongoose_1.model)("Item", itemSchema);
//# sourceMappingURL=Item.js.map