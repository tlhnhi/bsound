import UserController from "./controller";
import UserModel from "./model";

const router = require("express").Router();

router.get("/profile", async (req, res) => {
  const id = req.user._id;
  const user = await UserModel.findById(id).select("-password -__v");

  res.json({
    success: true,
    data: userObj,
  });
});

router.put("/profile", UserController.updateProfile);
router.put("/password", UserController.updatePassword);

export default router;
