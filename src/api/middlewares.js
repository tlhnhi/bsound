import UserModel from "../user/model";
import token from "../util/token";

export default {
  loginRequired: (req, res, next) => {
    if (!req.header("Authorization"))
      return res.status(401).json({
        success: false,
        message: "Please make sure your request has an Authorization header.",
      });

    // Validate jwt
    // let try_token = req.header("Authorization").split(" ")[0];
    let try_token = req.header("Authorization").replace("Bearer ", "");
    token.verifyToken(try_token, (err, payload) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: err,
        });
      UserModel.findById(payload.sub)
        .select("_id username password isLecturer")
        .exec((err, user) => {
          if (err || !user) {
            return res.status(404).json({
              success: false,
              message: err || "Please re-check your token!!!",
            });
          }
          req.user = user;
          next();
        });
    });
  },
};
