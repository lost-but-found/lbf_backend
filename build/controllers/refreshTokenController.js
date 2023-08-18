"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt)
        return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser)
        return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
            return res.json({ message: "No match!" }); // res.sendStatus(403);
        const accessToken = jwt.sign({
            email: decoded.email,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300s" });
        res.json({ accessToken });
    });
};
module.exports = { handleRefreshToken };
//# sourceMappingURL=refreshTokenController.js.map