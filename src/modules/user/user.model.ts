import { Schema, Document, model } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  photo?: string;
  phoneNumber: string;
  password: string;
  personalID: string;
  verified: boolean;
  bookmarked?: string[];
  tempOTP: {
    timeStamp: number;
    OTP: string;
  };
  refreshToken: string;
}

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: String,
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  personalID: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarked: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  verified: Boolean,
  tempOTP: {
    timeStamp: Number,
    OTP: String,
  },
  refreshToken: String,
});

// module.exports = mongoose.model("User", userSchema);
export default model<IUser>("User", userSchema);
