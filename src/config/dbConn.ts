import mongoose from "mongoose";
import { DATABASE_URL } from ".";

const connectToDatabase = async (callback: () => void) => {
  try {
    await mongoose.connect(DATABASE_URL, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    callback();
  });
};

export default connectToDatabase;
