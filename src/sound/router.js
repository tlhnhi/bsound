import { sendResponse, handleError } from "../util/response";
import SoundModel from "./model";
import CategoryModel from "../category/model";
import ConfigModel from "../configuration/model";

const router = require("express").Router();

router.get("/", async (req, res) => {
  const sounds = await SoundModel.find({}).select("-__v");
  return sendResponse(res, true, sounds);
});

router.get("/search/", async (req, res) => {
  let query = new Object();

  if (req.query.str) {
    let searchStr = req.query.str.replace("%20", " ");
    searchStr = { $regex: searchStr, $options: "i" };
    query.$or = [
      { name: searchStr },
      { category: searchStr },
      { tags: searchStr },
    ];
  }
  if (req.query.tags) {
    const str_tags = req.query.tags.replace("%20", " ");
    query.tags = {
      $all: str_tags.trim().split(" "),
    };
  }
  console.log("query", query);
  const sounds = await SoundModel.find(query).select("-__v");
  return sendResponse(res, true, sounds);
});

router.get("/share/:shareStr", async (req, res) => {
  let shareStr = req.params.shareStr;
  let sound, time, loop, bell, water, bird, thunder, wind, waves;
  try {
    shareStr = Buffer.from(shareStr, "base64").toString("ascii");

    [sound, time, loop, bell, water, bird, thunder, wind, waves] =
      shareStr.split("-");
  } catch (error) {
    console.log("Error: ", error.message);
    return handleError(res, false, "ShareString invalid.");
  }

  const config = { sound, time, loop, bell, water, bird, thunder, wind, waves };
  const soundObj = await SoundModel.findById(sound).select("-__v");
  if (!soundObj) return handleError(res, false, "ShareString invalid.");
  config.sound = soundObj;
  return sendResponse(res, true, config);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const sound = await SoundModel.findById(id).select("-__v");

  if (!sound)
    return handleError(res, false, "Can not find sound by provided id.");
  return sendResponse(res, true, sound);
});

router.post("/share/:id", async (req, res, next) => {
  const sound = req.params.id;
  const soundObj = await SoundModel.findById(sound);
  if (!soundObj)
    return handleError(res, false, "Can not find sound by provided id.");

  const time = req.body.time || 0;
  const loop = req.body.loop || false;
  const bell = req.body.bell || 0;
  const water = req.body.water || 0;
  const bird = req.body.bird || 0;
  const thunder = req.body.thunder || 0;
  const wind = req.body.wind || 0;
  const waves = req.body.waves || 0;

  let shareStr = `${sound}-${time}-${loop}-${bell}-${water}-${bird}-${thunder}-${wind}-${waves}`;
  console.log("shareStr", shareStr);
  shareStr = Buffer.from(shareStr).toString("base64");

  return sendResponse(res, true, { shareStr });
});

router.post("/", async (req, res) => {
  const { name, image, audio, tags, category } = req.body;
  const categoryObj = CategoryModel.findOne({ name: category }).select("-__v");
  if (!categoryObj)
    return handleError(res, false, "Can not find category by provided name.");

  const newSound = new SoundModel({ name, image, audio, tags, category });
  const sound = await newSound.save();
  return sendResponse(res, true, sound);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id || null;
  const sound = await SoundModel.findById(id);
  if (!sound)
    return handleError(res, false, "Can not find sound by provided id.");

  if (req.body.name !== undefined) sound.name = req.body.name;
  if (req.body.image !== undefined) sound.image = req.body.image;
  if (req.body.audio !== undefined) sound.audio = req.body.audio;
  if (req.body.tags !== undefined) sound.tags = req.body.tags;
  if (req.body.category !== undefined) {
    const categoryObj = CategoryModel.findOne({ name: category });
    if (!categoryObj)
      return handleError(res, false, "Can not find category by provided name.");

    sound.category = req.body.category;
  }

  if (!(await sound.save()))
    return handleError(res, false, "Can not update sound.");
  return sendResponse(res, true, sound);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id || null;
  const sound = await SoundModel.findByIdAndDelete(id);
  if (!sound)
    return handleError(res, false, "Can not find sound by provided id.");
  return sendResponse(res, true, category);
});

module.exports = router;
