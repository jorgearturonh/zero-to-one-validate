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
  totalCost: {
    type: Number,
    default: 0,
  },
})

IdeaIteratorSchema.pre("save", function(next) {
  if (this.tokenUsage && this.tokenUsage.length > 0) {
    this.totalCost = this.tokenUsage.reduce((total, usage) => {
      return total + (usage.cost || 0)
    }, 0)
  } else {
    this.totalCost = 0
  }
  next()
})

export const IdeaIteratorModel = mongoose.model(
  "IdeaIterator",
  IdeaIteratorSchema
)
