import { StatusCodes } from "http-status-codes";
import sgMail from "@sendgrid/mail";
import AuthService from "./auth.service";
import path from "path";
import { Request, Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import { sendResponse } from "../../utils/sendResponse";
import { UserModel, UserService } from "../user";
import { OTPTokenService } from "../otpToken";

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = await UserModel.findOne({ email }).exec();
  console.log(foundUser);

  if (!foundUser)
    return sendResponse({
      res,
      status: StatusCodes.NOT_FOUND,
      message: "User not found",
      success: false,
    });

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
      sameSite: "none",
      //   secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password, ...restUserProps } = foundUser.toObject();
    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "Login successful",
      success: true,
      data: { user: restUserProps, accessToken },
    });
  } else {
    sendResponse({
      res,
      status: StatusCodes.UNAUTHORIZED,
      message: "Incorrect username or password",
      success: false,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return sendResponse({
      res,
      status: StatusCodes.NO_CONTENT,
      message: "No content",
      success: false,
    }); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await UserModel.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return sendResponse({
      res,
      status: StatusCodes.NO_CONTENT,
      message: "No content",
      success: false,
    }); //No content
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return sendResponse({
    res,
    status: StatusCodes.NO_CONTENT,
    message: "No content",
    success: false,
  }); //No content
};

const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log(cookies);

  if (!cookies?.jwt) {
    return sendResponse({
      res,
      status: StatusCodes.UNAUTHORIZED,
      message: "Unauthorized",
      success: false,
    }); //Unauthorized
  }

  const refreshToken = cookies.jwt;

  const foundUser = await UserModel.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!foundUser) {
    return sendResponse({
      res,
      status: StatusCodes.FORBIDDEN,
      message: "Forbidden",
      success: false,
    }); //Forbidden
  }

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (
      err: Error,
      decoded: {
        email: string;
      }
    ) => {
      if (err || foundUser.email !== decoded.email)
        return sendResponse({
          res,
          status: StatusCodes.FORBIDDEN,
          message: "Forbidden",
          success: false,
        }); //Forbidden

      const accessToken = jwt.sign(
        {
          email: decoded.email,
        },
        JWT_SECRET_KEY,
        { expiresIn: "300s" }
      );
      sendResponse({
        res,
        status: StatusCodes.OK,
        message: "OK",
        success: true,
        data: { accessToken },
      });
    }
  );
};

const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  // const photo = req.file;
  // check for duplicate email or phone number in the db
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
    //hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    let OTP = AuthService.generateOTPService();

    //create and store the new user
    const result = await UserModel.create({
      name,
      email,
      password: hashedPwd,
      phone,
      // photo: "normalizedProfileImagePath",
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

    return sendResponse({
      res,
      status: StatusCodes.CREATED,
      message: "New user created!",
      success: true,
      data: { userId: result._id },
    });
  } catch (err: any) {
    return sendResponse({
      res,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
      success: false,
    });
  }
};

const resendOTP = async (req: Request, res: Response) => {
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

const sendEmailOTP = async (req: Request, res: Response) => {
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

    let OTP = await OTPTokenService.generateOTP(user._id, "emailVerification");
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

const sendPhoneOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;

  try {
    const user = await UserModel.findOne({ phone }).exec();
    if (!user) {
      return sendResponse({
        res,
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
        success: false,
      });
    }

    let OTP = await OTPTokenService.generateOTP(user._id, "phoneVerification");
    console.log({ OTP });

    //Update OTP of user
    const updatedUserOTP = await UserModel.findOneAndUpdate(
      { phone },
      {
        $set: {
          "tempOTP.OTP": String(OTP),
          "tempOTP.timeStamp": Date.now(),
        },
      },
      { new: true }
    );

    console.log(updatedUserOTP);
    AuthService.sendOTPService(phone, OTP);
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

const verifyEmailOTP = async (
  req: Request & {
    userId: string;
  },
  res: Response
) => {
  const { token, email } = req.body;

  const user = await UserModel.findOne({ email }).exec();

  if (!user) {
    return sendResponse({
      res,
      status: StatusCodes.NOT_FOUND,
      message: "User does not exist",
      success: false,
    });
  }

  const isVerified = await AuthService.verifyUserEmail(user._id, token);
  if (isVerified) {
    // Update user's email verification status
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
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
  const { token, phone } = req.body;

  const user = await UserModel.findOne({ phone }).exec();

  if (!user) {
    return sendResponse({
      res,
      status: StatusCodes.NOT_FOUND,
      message: "User does not exist",
      success: false,
    });
  }

  const isVerified = await AuthService.verifyUserPhone(user._id, token);
  if (isVerified) {
    // Update user's phone verification status
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
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

const checkIfEmailOrPhoneExists = async (req: Request, res: Response) => {
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
      return sendResponse({
        res,
        status: 404,
        message: "User does not exist",
        success: false,
      });
    }
  } catch (error) {
    sendResponse({
      res,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to check if user exists",
      success: false,
    });
  }
};

const requestPasswordReset = async (req: Request, res: Response) => {
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

    let OTP = await OTPTokenService.generateOTP(user._id, "passwordReset");
    console.log({ OTP });

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

const verifyPasswordReset = async (req: Request, res: Response) => {
  const { otp } = req.body;

  const isVerified = await AuthService.verifyPasswordReset(otp);
  if (isVerified) {
    console.log("OTP verified successfully");
    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "OTP verified successfully",
      success: true,
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

export const resetPassword = async (req: Request, res: Response) => {
  const { password: newPassword, otp } = req.body;
  try {
    const otpToken = await AuthService.verifyPasswordReset(otp);
    console.log({ otpToken });
    if (!otpToken) {
      return sendResponse({
        res,
        status: StatusCodes.BAD_REQUEST,
        message: "Invalid or expired token",
        success: false,
      });
    }

    const user = await UserModel.findById(otpToken.userId).exec();

    if (!user) {
      // return res
      //   .status(404)
      //   .send({ error: "No user registered with that email or phone number" });
      return sendResponse({
        res,
        status: StatusCodes.NOT_FOUND,
        message: "No such registered user",
        success: false,
      });
    }

    //hash the password
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPwd;
    const { password, ...updatedUser } = (await user.save()).toObject();

    // Delete the otpToken
    await OTPTokenService.deleteOTP(otpToken.token, "passwordReset");

    sendResponse({
      res,
      status: StatusCodes.OK,
      message: "Password reset successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    sendResponse({
      res,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while resetting password",
      success: false,
    });
  }
};

const AuthController = {
  login,
  logout,
  resetPassword,
  requestPasswordReset,
  sendEmailOTP,
  sendPhoneOTP,
  refreshToken,
  register,
  verifyPasswordReset,
  resendOTP,
  verifyEmailOTP,
  verifyPhoneOTP,
  checkIfEmailOrPhoneExists,
};

export default AuthController;
