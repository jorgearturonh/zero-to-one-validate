import mongoose, { Schema } from "mongoose"

const FeedbackSchema = new Schema({
  likesMost: {
    type: String,
  },
  improvements: {
    type: String,
  },
  missingFeatures: {
    type: String,
  },
  overallExperience: {
    type: String,
  },
})

export const FeedbackModel = mongoose.model("Feedback", FeedbackSchema)
