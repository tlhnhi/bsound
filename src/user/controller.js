import UserModel from "./model";

export default {
  updatePassword: (req, res, next) => {
    req.user.comparedPassword(req.body.password, async (err, good) => {
      if (err || !good)
        return res.status(401).json({
          success: false,
          message: err || "Incorrect Password",
        });
      if (req.body.newPassword === undefined)
        return res.json({
          success: false,
          data: "Please provide new password.",
        });
      const userId = req.user._id;
      let user = await UserModel.findById(userId);
      user.password = req.body.newPassword || null;

      await user.save();
      return res.status(200).json({
        success: true,
        data: "Change password successfully.",
      });
    });
  },
  updateProfile: async (req, res, next) => {
    const userId = req.user._id;
    let user = await UserModel.findById(userId).select("-password -__v");
    if (req.body.name) user.name = req.body.name;

    await user.save();
    return res.status(200).json({
      success: true,
      data: "Update profile successfully.",
    });
  },
  resetPassword: async (req, res, next) => {
    const username = req.body.username;
    let user = await UserModel.findOne({ username: username }).select(
      "-password -__v"
    );
    if (req.body.password) user.password = req.body.password;
    else
      return res.json({
        success: false,
        message: "Please provide new password.",
      });

    await user.save();
    return res.status(200).json({
      success: true,
      data: "Reset password successfully.",
    });
  },
};
