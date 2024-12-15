import { Schema } from "mongoose"

export const FinalAnalysisSchema = new Schema({
  uniqueness: {
    type: Number,
    min: 1,
    max: 100,
  },
  description: {
    type: String,
  },
  recommendations: {
    type: String,
  },
})
