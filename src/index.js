import express from "express";
import http from "http";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config";
import Middlewares from "./api/middlewares";
import Authentication from "./api/authentication";

import UserRouter from "./user/router";
import UserController from "./user/controller";

import CategoryRouter from "./category/router";
import SoundRouter from "./sound/router";
import ConfigRouter from "./configuration/router";

if (!process.env.JWT_SECRET) {
  let err = new Error("No JWT_SECRET in env variable");
  console.error(err);
}

const app = express();

mongoose
  .connect(config.mongoose.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.get("/", (req, res) => res.json({ connect: "success" }));
app.post("/signup", Authentication.signup);
app.post("/signin", Authentication.signin);
app.get("/auth-ping", Middlewares.loginRequired, (req, res) =>
  res.json({ success: true })
);
app.use("/user", Middlewares.loginRequired, UserRouter);
app.use("/category", CategoryRouter);
app.use("/sound", SoundRouter);
app.use("/configuration", Middlewares.loginRequired, ConfigRouter);

app.post("/reset-password", UserController.resetPassword);

app.use((err, req, res, next) => {
  console.log("\nError:", err.message);
  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

// Server Setup
const port = process.env.PORT || 8000;
http.createServer(app).listen(port, () => {
  console.log(`\x1b[32m`, `Server listening on: ${port}`, `\x1b[0m`);
});
