import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
      },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
