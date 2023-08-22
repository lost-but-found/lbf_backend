import User from "./user.model";

const findUserByEmailOrPhone = async ({ email, phone }) => {
  try {
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const UserService = { findUserByEmailOrPhone };

export default UserService;
