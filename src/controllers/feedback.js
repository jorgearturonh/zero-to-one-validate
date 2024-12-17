import { FeedbackModel } from "../models/Feedback.js"
import verboseConsole from "../utils/console/verboseConsole.js"

const feedback = async (req, res) => {
  try {
    const {
      likesMost,
      improvements,
      missingFeatures,
      overallExperience,
    } = req.body
    verboseConsole(
      `[FEEDBACK]: Likes most: ${likesMost}, Improvements: ${improvements}, Missing features: ${missingFeatures}, Overall experience: ${overallExperience}`,
      "blue"
    )
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
