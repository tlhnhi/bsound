import mongoose from "mongoose";

// Define the model
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    audio: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { collation: { locale: "vi" } }
);

// Export the model
export default mongoose.model("Sound", Schema);
