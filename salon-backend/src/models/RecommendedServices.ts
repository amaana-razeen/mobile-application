import mongoose from "mongoose";

const recommendedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    default: "",
  },
  route: {
    type: String,
    default: "",
  },
});

export default mongoose.model("RecommendedService", recommendedSchema);