import mongoose, { Schema } from "mongoose"
import { TokenUsageSchema } from "../schemas/TokenUsage.js"
import { QuerySchema } from "../schemas/Query.js"
import { FinalAnalysisSchema } from "../schemas/FinalAnalysis.js"

const ZeroToOneValidateSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
    queries: [
      {
        type: QuerySchema,
      },
    ],
    finalAnalysis: {
      type: FinalAnalysisSchema,
    },
    tokenUsage: [
      {
        type: TokenUsageSchema,
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

ZeroToOneValidateSchema.pre("save", function(next) {
  if (this.tokenUsage && this.tokenUsage.length > 0) {
    this.totalCost = this.tokenUsage.reduce((total, usage) => {
      return total + (usage.cost || 0)
    }, 0)
  } else {
    this.totalCost = 0
  }
  next()
})

export default mongoose.model("ZeroToOneValidate", ZeroToOneValidateSchema)
