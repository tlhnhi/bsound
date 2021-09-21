import mongoose from "mongoose";

// Define the model
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { collation: { locale: "vi" } }
);

// Export the model
export default mongoose.model("Category", Schema);
