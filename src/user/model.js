import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the model
const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Unnamed",
    },
  },
  { collation: { locale: "vi" } }
);

Schema.pre("save", function (next) {
  // get access to user model, then we can use user.username, user.password
  const user = this;
  if (user.password === undefined) next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

// Make use of methods for comparedPassword
Schema.methods.comparedPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, good) {
    if (err) {
      return cb(err);
    }
    cb(null, good);
  });
};

// Export the model
export default mongoose.model("User", Schema);
