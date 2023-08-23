import sgMail from "@sendgrid/mail";
import { OTPTokenService } from "../otpToken";

// Function to create random OTP code
const generateOTPService = () => {
  const code = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return code;
};

const sendOTPService = async (email: string, OTP: string) => {
  const msg = {
    to: email,
    from: "lostbutfounditemsapp@gmail.com",
    subject: "Verify your email",
    text: `Your OTP code is ${OTP}`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error(error + "Error!");
    // throw new Error("Failed to send OTP code");
  }
};

export async function verifyUserEmail(
  userId: string,
  token: string
): Promise<boolean> {
  return OTPTokenService.verifyOTP(userId, token, "emailVerification");
}

export async function verifyUserPhone(
  userId: string,
  token: string
): Promise<boolean> {
  return OTPTokenService.verifyOTP(userId, token, "phoneVerification");
}

const AuthService = { generateOTPService, sendOTPService };

export default AuthService;
