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

async function verifyOTP({
  token,
  type,
  userId,
  deleteOnVerify = true,
}: {
  token: string;
  type: OTPToken["type"];
  userId?: string;
  deleteOnVerify?: boolean;
}): Promise<boolean> {
  const otpToken = await OTPTokenModel.findOne({
    userId,
    token,
    type,
    expiresAt: { $gt: new Date() }, // Check if token is not expired
  });

  if (!otpToken) {
    return false;
  }

  if (deleteOnVerify) await OTPTokenModel.deleteOne({ _id: otpToken._id });
  return true;
}

async function getOTP(
  token: string,
  type: OTPToken["type"]
): Promise<OTPToken | null> {
  const otpToken = await OTPTokenModel.findOne({
    token,
    type,
    expiresAt: { $gt: new Date() }, // Check if token is not expired
  });

  if (!otpToken) {
    return null;
  }

  return otpToken;
}

async function deleteOTP(token: string, type: OTPToken["type"]): Promise<void> {
  const otpToken = await OTPTokenModel.findOne({
    token,
    type,
    expiresAt: { $gt: new Date() }, // Check if token is not expired
  });

  console.log("otpToken", otpToken);

  if (!otpToken) {
    return;
  }

  await OTPTokenModel.deleteOne({ _id: otpToken._id });
}

const OTPTokenService = {
  generateOTP,
  verifyOTP,
  getOTP,
  deleteOTP,
};

export default OTPTokenService;
