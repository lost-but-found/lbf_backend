import { StatusCodes } from "http-status-codes";
import sgMail from "@sendgrid/mail";
import AuthService, { verifyUserEmail, verifyUserPhone } from "./auth.service";
import path from "path";
import { Request, Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import { sendResponse } from "../../utils/sendResponse";
import { UserModel, UserService } from "../user";
import { OTPTokenService } from "../otpToken";

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

export const resetPassword = async (req, res) => {
  const { email, phone } = req.body;

  let user;
  if (email) {
    user = await UserModel.findOne({ email });
  } else if (phone) {
    user = await UserModel.findOne({ phone });
  } else {
    return res.status(400).send({ error: "Invalid request" });
  }

  if (!user) {
    res
      .status(404)
      .send({ error: "No user registered with that email or phone number" });
  }

  const token = AuthService.generateOTPService();

  const sendToken = async (email, token) => {
    const msg = {
      to: email,
      from: "lostbutfounditemsapp@gmail.com",
      subject: "Reset Your Password",
      text: `Your Password reset code is: ${token}`,
    };

    try {
      await sgMail.send(msg);
      console.log(`Token sent to ${email}`);
    } catch (error) {
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
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
};

const sendOTPToUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return sendResponse({
        res,
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
        success: false,
      });
    }

    let OTP = OTPTokenService.generateOTP(user._id, "emailVerification");
    console.log({ OTP });

    //Update OTP of user
    const updatedUserOTP = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          "tempOTP.OTP": String(OTP),
          "tempOTP.timeStamp": Date.now(),
        },
      },
      { new: true }
    );

    console.log(updatedUserOTP);
    AuthService.sendOTPService(email, OTP);
    // return OTP;
    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to send OTP code",
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = await UserModel.findOne({ email }).exec();
  console.log(foundUser);

  if (!foundUser) return res.status(401).send({ message: "Unauthorized" }); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        user: {
          _id: foundUser._id,
          email: foundUser.email,
        },
      },
      JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        user: {
          _id: foundUser._id,
          email: foundUser.email,
        },
      },
      JWT_SECRET_KEY,
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

const logout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await UserModel.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await UserModel.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!foundUser) return res.sendStatus(403); //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email)
      return res.json({ message: "No match!" }); // res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        email: decoded.email,
      },
      JWT_SECRET_KEY,
      { expiresIn: "300s" }
    );
    res.json({ accessToken });
  });
};

const handleNewUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!email || !password || !name || !phone)
    return res.status(400).json({ message: "Please fill in all details" });

  // check for duplicate usernames in the db
  const duplicateEmail = await UserModel.findOne({ email }).exec();
  if (duplicateEmail)
    return res
      .status(409)
      .send({ error: "Email already registered by another user." });

  const duplicateNumber = await UserModel.findOne({ phone }).exec();
  if (duplicateNumber)
    return res
      .status(409)
      .send({ error: "Phone number already registered by another user." });

  const profileImg: string | undefined = req.file?.path;

  /* Normalize the image path using path module. Without this, Windows will make use of
  backward slashes which is not readable by web systems and other OSs */
  const normalizedProfileImagePath = profileImg?.split(path.sep).join("/");

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    let OTP = AuthService.generateOTPService();

    //create and store the new user
    const result = await UserModel.create({
      name,
      email,
      password: hashedPwd,
      phone,
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
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}`);
    res.status(201).json({ success: `New user created!`, userId: result._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  const photo = req.file;
  // check for duplicate usernames in the db
  // @ts-ignore
  const duplicateEmail = await UserModel.findOne({ email }).exec();
  if (duplicateEmail) {
    return sendResponse({
      res,
      status: StatusCodes.CONFLICT,
      message: "Email already registered by another user.",
      success: false,
    });
  }

  const duplicateNumber = await UserModel.findOne({ phone }).exec();
  if (duplicateNumber)
    return sendResponse({
      res,
      status: StatusCodes.CONFLICT,
      message: "Phone number already registered by another user.",
      success: false,
    });

  /* Normalize the image path using path module. Without this, Windows will make use of
  backward slashes which is not readable by web systems and other OSs */
  // const normalizedProfileImagePath = profileImg?.split(path.sep).join("/");

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    let OTP = AuthService.generateOTPService();

    //create and store the new user
    const result = await UserModel.create({
      name,
      email,
      password: hashedPwd,
      phone,
      photo: "normalizedProfileImagePath",
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
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}`);
    res.status(201).json({ success: `New user created!`, userId: result._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;

  let OTP = AuthService.generateOTPService();
  try {
    AuthService.sendOTPService(email, OTP);

    //Update OTP of user
    const updatedUserOTP = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          "tempOTP.OTP": String(OTP),
          "tempOTP.timeStamp": Date.now(),
        },
      },
      { new: true }
    );

    console.log(updatedUserOTP);
    console.log(OTP);
    // return OTP;
    res.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to send OTP code" });
  }
};

const verifyEmailOTP = async (
  req: Request & {
    userId: string;
  },
  res: Response
) => {
  const { token } = req.body;

  const isVerified = await verifyUserEmail(req.userId, token);
  if (isVerified) {
    // Update user's email verification status
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { isEmailVerified: true },
      { new: true }
    );
    console.log("Email verified successfully");
    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "Email verified successfully",
      success: true,
      data: updatedUser,
    });
  } else {
    console.log("Invalid or expired token");
    sendResponse({
      res,
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid or expired token",
      success: false,
    });
  }
};

const verifyPhoneOTP = async (
  req: Request & {
    userId: string;
  },
  res: Response
) => {
  const { token } = req.body;

  const isVerified = await verifyUserPhone(req.userId, token);
  if (isVerified) {
    // Update user's phone verification status
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { isPhoneVerified: true },
      { new: true }
    );

    console.log("Phone number verified successfully");
    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "Phone number verified successfully",
      success: true,
      data: updatedUser,
    });
  } else {
    console.log("Invalid or expired token");
    sendResponse({
      res,
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid or expired token",
      success: false,
    });
  }
};

const checkIfEmailOrPhoneExists = async (req, res) => {
  const { email, phone } = req.params;

  try {
    const user = await UserService.findUserByEmailOrPhone({
      email,
      phone: phone,
    });
    if (user) {
      return sendResponse({
        res,
        status: 200,
        message: "User exists",
        success: true,
      });
    } else {
      // return res.status(404).send({ message: "User does not exist" });
      return sendResponse({
        res,
        status: 404,
        message: "User does not exist",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to check if user exists" });
  }
};

const AuthController = {
  login,
  logout,
  resetPassword,
  sendOTPToUser,
  refreshToken,
  register,
  resendOTP,
  verifyEmailOTP,
  verifyPhoneOTP,
  checkIfEmailOrPhoneExists,
};

export default AuthController;
