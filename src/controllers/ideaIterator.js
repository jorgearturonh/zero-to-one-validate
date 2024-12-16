import { generateIdeaIteratorRecommendations } from "../utils/langchain/zeroToOne.js"
import { IdeaIteratorModel } from "../models/IdeaIterator.js"

export const generateIdeaIterator = async (req, res) => {
  try {
    const { input } = req.body

    if (!input) {
      return res.status(400).json({ error: "Input is required" })
    }

    const { response, tokenUsage } = await generateIdeaIteratorRecommendations(
      input
    )

    const ideaIterator = new IdeaIteratorModel({
      input,
      recommendations: response.recommendations,
      tokenUsage,
    })

    ideaIterator.save()

    return res.status(200).json({
      recommendations: response.recommendations,
    })
  } catch (error) {
    console.error("Error in generateIdeaIterator:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
