const Item = require("../models/Item");

const handleFoundItem = async (res, req) => {
  const { title, desc, missing, userId } = req.body;

  //   try {
  //     const { userId } = req.params;
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }
  //     const items = await Item.find({ user: user._id });
  //     res.json(items);
  //   } catch (error) {
  //     res.status(500).json({ error: "An error occurred" });
  //   }
};

module.exports = { handleFoundItem };
