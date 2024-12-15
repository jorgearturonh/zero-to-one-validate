import { Schema } from "mongoose"

export const QueryAnalysisSchema = new Schema({
  isProjectOrCompany: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  insights: {
    type: String,
  },
})
