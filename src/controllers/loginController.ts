import User from "../models/User";
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = await User.findOne({ email }).exec();
  console.log(foundUser);

  if (!foundUser) return res.status(401).send({ message: "Unauthorized" }); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //   secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ userId: foundUser._id, accessToken });
  } else {
    res.status(401).send({ message: "Incorrect username or password" });
  }
};

export { handleLogin };
