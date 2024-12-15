import mongoose from "mongoose"
import { calculatePrice } from "../utils/pricing/index.js"

const { Schema } = mongoose

export const TokenUsageSchema = new Schema(
  {
    model: {
      type: String,
      required: true,
    },
    tokenUsage: {
      completionTokens: {
        type: Number,
      },
      promptTokens: {
        type: Number,
      },
      totalTokens: {
        type: Number,
      },
    },
    cost: {
      type: Number,
      default: function() {
        return calculatePrice(this.model, this.tokenUsage)
      },
    },
  },
  {
    timestamps: true,
  }
)
