import { sendResponse, handleError } from "../util/response";
import ConfigModel from "./model";
import SoundModel from "../sound/model";

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  const config = await ConfigModel.find({
    user: req.user.username,
  })
    .populate("sound", "-__v")
    .select("-__v");
  return sendResponse(res, true, config);
});

router.get("/:id", async (req, res, next) => {
  const sound_id = req.params.id;
  const sound = await SoundModel.findById(sound_id).select("-__v");

  if (!sound)
    return handleError(res, false, "Can not find sound by provided id.");

  const config = await ConfigModel.findOne({
    user: req.user.username,
    sound: sound_id,
  }).select("-__v");

  config.sound = sound;
  return sendResponse(res, true, config);
});

router.get("/byId/:id", async (req, res, next) => {
  const id = req.params.id;
  const config = await ConfigModel.findById(id).select("-__v");

  if (!config)
    return handleError(
      res,
      false,
      "Can not find configuration by provided id."
    );
  return sendResponse(res, true, config);
});

router.post("/:id", async (req, res, next) => {
  let error = undefined;
  const user = req.user.username || undefined;
  const sound = req.params.id || undefined;

  const soundObj = await SoundModel.findById(sound);
  if (!soundObj)
    return handleError(res, false, "Can not find sound by provided id.");

  const time = req.body.time || undefined;
  const loop = req.body.loop || undefined;
  const bell = req.body.bell || undefined;
  const water = req.body.water || undefined;
  const bird = req.body.bird || undefined;
  const rain = req.body.rain || undefined;
  const wind = req.body.wind || undefined;
  const people = req.body.people || undefined;

  let config = await ConfigModel.findOne({
    user: user,
    sound: sound,
  });
  if (!config) {
    const newConfig = new ConfigModel({
      user,
      sound,
      time,
      loop,
      bell,
      water,
      bird,
      rain,
      wind,
      people,
    });
    config = await newConfig.save().catch((err) => {
      error = err;
    });
  } else {
    if (time !== undefined) config.time = time;
    if (loop !== undefined) config.loop = loop;
    if (bell !== undefined) config.bell = bell;
    if (water !== undefined) config.water = water;
    if (bird !== undefined) config.bird = bird;
    if (rain !== undefined) config.rain = rain;
    if (wind !== undefined) config.wind = wind;
    if (people !== undefined) config.people = people;

    await config.save().catch((err) => {
      error = err;
    });
  }
  if (error) return handleError(res, false, error.message);
  return sendResponse(res, true, config);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id || null;
  const config = await ConfigModel.findByIdAndDelete(id);
  if (!config)
    return handleError(
      res,
      false,
      "Can not find configuration by provided id."
    );
  return sendResponse(res, true, config);
});

module.exports = router;
