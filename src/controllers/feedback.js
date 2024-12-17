import { FeedbackModel } from "../models/Feedback.js"

const feedback = async (req, res) => {
  try {
    const {
      likesMost,
      improvements,
      missingFeatures,
      overallExperience,
    } = req.body
    const feedback = new FeedbackModel({
      likesMost,
      improvements,
      missingFeatures,
      overallExperience,
    })
    feedback.save()
    res
      .status(200)
      .json({ message: "Feedback saved successfully", success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default feedback
