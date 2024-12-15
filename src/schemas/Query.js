import { Schema } from "mongoose"
import { STATUS_TYPES } from "../consts/index.js"
import { QueryAnalysisSchema } from "./QueryAnalysis.js"

export const QuerySchema = new Schema({
  query: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: STATUS_TYPES.PENDING,
    enum: [
      STATUS_TYPES.PENDING,
      STATUS_TYPES.SEARCHING,
      STATUS_TYPES.COMPLETED,
    ],
  },
  results: [
    {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
      snippet: {
        type: String,
      },
      analysis: {
        type: QueryAnalysisSchema,
      },
    },
  ],
})
