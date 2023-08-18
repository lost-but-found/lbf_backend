import User from "../models/User";
import sgMail from "@sendgrid/mail";
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  const userId = req.userId;

  if (userId) {
    try {
      const user = await User.findById(userId);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).send({ message: "Account not found" });
  }
};

export { resetPassword };
