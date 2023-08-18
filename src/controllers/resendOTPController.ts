import sgMail from "@sendgrid/mail";
import User from "../models/User";

// Function to create random OTP code
export const generateOTP = () => {
  const code = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return code;
};

const sendOTP = async (email, OTP) => {
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
    throw new Error("Failed to send OTP code");
  }
};

const sendOTPToUser = async (req, res) => {
  const { email } = req.body;

  let OTP = generateOTP();
  try {
    sendOTP(email, OTP);

    //Update OTP of user
    const updatedUserOTP = await User.findOneAndUpdate(
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

export { sendOTPToUser };
