import mongoose, { Schema } from "mongoose"
import { TokenUsageSchema } from "../schemas/TokenUsage.js"

const IdeaIteratorSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  recommendations: [
    {
      type: String,
    },
  ],
  tokenUsage: {
    type: TokenUsageSchema,
  },
})

export const IdeaIteratorModel = mongoose.model(
  "IdeaIterator",
  IdeaIteratorSchema
)
