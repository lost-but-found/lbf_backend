import User from "../models/User";
import sgMail from "@sendgrid/mail";
import { generateOTP } from "./resendOTPController";
const bcrypt = require("bcrypt");

export const resetPassword = async (req, res) => {
  const { email, phoneNumber } = req.body;

  let user;
  if (email) {
    user = await User.findOne({ email });
  } else if (phoneNumber) {
    user = await User.findOne({ phoneNumber });
  } else {
    return res.status(400).send({ error: "Invalid request" });
  }

  if (!user) {
    res
      .status(404)
      .send({ error: "No user registered with that email or phone number" });
  }

  const token = generateOTP();

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
