import mongoose from "mongoose";

const motivationSchema = new mongoose.Schema(
  {
    motivation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Motivation = mongoose.model("Motivation", motivationSchema);

export default Motivation;