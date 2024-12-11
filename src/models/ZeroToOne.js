import mongoose from "mongoose"
import { STATUS_TYPES } from "../consts/index.js"

const { Schema } = mongoose

const ZeroToOneValidateSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
    queries: [
      {
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
              isProjectOrCompany: {
                type: Boolean,
              },
              description: {
                type: String,
              },
              insights: {
                type: String,
              },
            },
          },
        ],
      },
    ],
    finalAnalysis: {
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
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("ZeroToOneValidate", ZeroToOneValidateSchema)
