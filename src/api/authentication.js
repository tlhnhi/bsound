import token from "../util/token";
import UserModel from "../user/model";
require("babel-polyfill"); // allow async

export default {
  signup: (req, res, next) => {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(422).json({
        success: false,
        message: "You must provide username and password.",
      });
    }
    UserModel.findOne(
      {
        username: username,
      },
      function (err, existingUser) {
        if (err)
          return res.status(422).json({
            success: false,
            message: err,
          });
        if (existingUser) {
          return res.status(422).json({
            success: false,
            message: "Username is in use",
          });
        }
        const user = new UserModel({
          name: name,
          username: username,
          password: password,
        });

        user.save(function (err, savedUser) {
          if (err) {
            return next(err);
          }
          var userToken = token.generateToken(savedUser);
          res.json({
            success: true,
            token: userToken,
          });
        });
      }
    );
  },

  signin: (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(422).json({
        success: false,
        error: "You must provide username and password.",
      });
    }
    UserModel.findOne(
      {
        username: username,
      },
      function (err, existingUser) {
        if (err || !existingUser) {
          return res.status(401).json({
            status: false,
            message: err || "Incorrect Username or Password",
          });
        }
        if (existingUser) {
          existingUser.comparedPassword(password, function (err, good) {
            if (err || !good) {
              return res.status(401).json({
                status: false,
                message: err || "Incorrect Username or Password",
              });
            }

            res.json({
              success: true,
              data: {
                token: token.generateToken(existingUser),
              },
            });
          });
        }
      }
    );
  },
};
