import crypto from "crypto";
import OTPTokenModel, { OTPToken } from "./otpToken.model";

const OTP_EXPIRY_MINUTES = 15;

async function generateOTP(
  userId: string,
  type: OTPToken["type"]
): Promise<string> {
  const token = crypto.randomBytes(6).toString("hex");
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); // Convert minutes to milliseconds

  const otpToken = new OTPTokenModel({
    token,
    userId,
    type,
    expiresAt,
  });

  await otpToken.save();
  return token;
}

async function verifyOTP(
  userId: string,
  token: string,
  type: OTPToken["type"]
): Promise<boolean> {
  // const otpToken = await OTPTokenModel.findOne({
  //   userId,
  //   token,
  //   type,
  //   expiresAt: { $gt: new Date() }, // Check if token is not expired
  // });

  await OTPTokenModel.deleteOne({
    userId,
    token,
    type,
    expiresAt: { $gt: new Date() }, // Check if token is not expired
  });
  return true;
  // if (otpToken) {
  // }

  // return false;
}

const OTPTokenService = {
  generateOTP,
  verifyOTP,
};

export default OTPTokenService;
