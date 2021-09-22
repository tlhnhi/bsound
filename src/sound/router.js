import { sendResponse, handleError } from "../util/response";
import SoundModel from "./model";
import CategoryModel from "../category/model";

const router = require("express").Router();

router.get("/", async (req, res) => {
  const sounds = await SoundModel.find({}).select("-__v");
  return sendResponse(res, true, sounds);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const sound = await SoundModel.findById(id).select("-__v");

  if (!sound)
    return handleError(res, false, "Can not find sound by provided id.");
  return sendResponse(res, true, sound);
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

router.post("/search/", async (req, res) => {
  let query = new Object();

  if (req.query.str) {
    const str = req.query.str.replace("%20", " ");
    query.$text = { $search: str };
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

module.exports = router;
