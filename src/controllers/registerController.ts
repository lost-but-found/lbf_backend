import User from "../models/User";
import sgMail from "@sendgrid/mail";
import path from "path";
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { fullName, email, pwd, phoneNumber } = req.body;
  if (!email || !pwd || !fullName || !phoneNumber)
    return res.status(400).json({ message: "Please fill in all details" });

  // check for duplicate usernames in the db
  const duplicateEmail = await User.findOne({ email }).exec();
  if (duplicateEmail)
    return res
      .status(409)
      .send({ error: "Email already registered by another user." });

  const duplicateNumber = await User.findOne({ phoneNumber }).exec();
  if (duplicateNumber)
    return res
      .status(409)
      .send({ error: "Phone number already registered by another user." });

  // Function to create random OTP code
  const generateOTP = () => {
    const code = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return code;
  };

  const profileImg: string | undefined = req.file?.path;

  /* Normalize the image path using path module. Without this, Windows will make use of
  backward slashes which is not readable by web systems and other OSs */
  const normalizedProfileImagePath = profileImg?.split(path.sep).join("/");

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    let OTP = generateOTP();

    //create and store the new user
    const result = await User.create({
      fullName,
      email,
      password: hashedPwd,
      phoneNumber,
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

export { handleNewUser };
