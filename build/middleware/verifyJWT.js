"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
        // res.send({ message: "No header found!" });
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).send({ error: "Access token expired or invalid" });
            console.log(err);
        }
        req.user = decoded.UserInfo.email;
        req.userId = decoded.UserInfo._id;
        next();
    });
};
exports.default = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map