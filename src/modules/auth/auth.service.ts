import sgMail from "@sendgrid/mail";
import { OTPToken, OTPTokenService } from "../otpToken";

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

async function verifyUserEmail(
  userId: string,
  token: string
): Promise<boolean> {
  return OTPTokenService.verifyOTP({
    token,
    type: "emailVerification",
    userId,
  });
}

async function verifyUserPhone(
  userId: string,
  token: string
): Promise<boolean> {
  return OTPTokenService.verifyOTP({
    token,
    type: "phoneVerification",
    userId,
  });
}

export async function verifyPasswordReset(
  token: string
): Promise<OTPToken | null> {
  return OTPTokenService.getOTP(token, "passwordReset");
}

const AuthService = {
  generateOTPService,
  sendOTPService,
  verifyUserEmail,
  verifyUserPhone,
  verifyPasswordReset,
};

export default AuthService;
