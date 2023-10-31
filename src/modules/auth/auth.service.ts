import sgMail from "@sendgrid/mail";
import { OTPToken, OTPTokenService } from "../otpToken";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config";
import { promisify } from "util";

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
  console.log("verifyUserEmail", userId, token);
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
const jwtVerifyAsync = promisify(
  (
    token: string,
    secret: string,
    callback: jwt.VerifyCallback<string | jwt.JwtPayload>
  ) => jwt.verify(token, secret, callback)
);

export async function verifyAuthToken(token: string): Promise<{
  user: { _id: string; email: string };
} | null> {
  try {
    console.log("token", token);

    const decoded = await jwtVerifyAsync(token, JWT_SECRET_KEY);

    console.log("decoded", decoded);
    if (!decoded) {
      return null;
    }

    return decoded as { user: { _id: string; email: string } };
  } catch (error) {
    console.error(error);
    console.log("error");
    return null;
  }
}

export function generateJWTToken(user: { _id: string; email: string }) {
  // create JWTs
  const accessToken = jwt.sign(
    {
      user,
    },
    JWT_SECRET_KEY,
    { expiresIn: "120d" }
  );
  const refreshToken = jwt.sign(
    {
      user,
    },
    JWT_SECRET_KEY,
    { expiresIn: "210d" }
  );

  return {
    accessToken,
    refreshToken,
  };
}

const AuthService = {
  generateJWTToken,
  generateOTPService,
  sendOTPService,
  verifyUserEmail,
  verifyUserPhone,
  verifyPasswordReset,
  verifyAuthToken,
};

export default AuthService;
