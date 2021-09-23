import mongoose from "mongoose";

// Define the model
const Schema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    sound: {
      type: mongoose.Schema.ObjectId,
      ref: "Sound",
      required: true,
    },
    time: {
      type: Number,
      default: 5,
      min: [5, "Minimum should be 5"],
      max: [60, "Maximum should be 60"],
    },
    loop: {
      type: Boolean,
      default: false,
    },
    bell: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
    water: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
    bird: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
    thunder: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
    wind: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
    waves: {
      type: Number,
      default: 0,
      min: [1, "Minimum should be 1"],
      max: [20, "Maximum should be 60"],
    },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

// Export the model
export default mongoose.model("Config", Schema);
