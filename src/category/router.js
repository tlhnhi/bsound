import { sendResponse, handleError } from "../util/response";
import CategoryModel from "./model";
import SoundModel from "../sound/model";

const router = require("express").Router();

router.get("/", async (req, res) => {
  const categories = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "sounds",
        localField: "name",
        foreignField: "category",
        as: "sounds",
      },
    },
    { $unset: ["__v"] },
  ]);
  return sendResponse(res, true, categories);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id || null;
  let category = await CategoryModel.findById(id).select("-__v");
  if (!category)
    return handleError(res, false, "Can not find category by provided id.");

  category = category.toJSON();
  category.sounds = await SoundModel.find({ category: category.name }).select(
    "-__v"
  );
  return sendResponse(res, true, category);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const newCategory = new CategoryModel({ name });
  const category = await newCategory.save();
  return sendResponse(res, true, category);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id || null;
  const category = await CategoryModel.findById(id);
  if (!category)
    return handleError(res, false, "Can not find category by provided id.");

  if (req.body.name !== undefined) category.name = req.body.name;

  if (!(await category.save()))
    return handleError(res, false, "Can not update category.");
  return sendResponse(res, true, category);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id || null;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category)
    return handleError(res, false, "Can not find category by provided id.");
  return sendResponse(res, true, category);
});

module.exports = router;
