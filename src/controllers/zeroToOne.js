import {
  generateFinalAnalysis,
  generateQueries,
  generateSearchResultAnalysis,
} from "../utils/langchain/index.js"
import makeSerperRequest from "../utils/serper/index.js"
import { AMBIGOUS_IDEA_MESSAGE, STATUS_TYPES } from "../consts/index.js"
import verboseConsole from "../utils/console/verboseConsole.js"
import { emitUpdate, joinRoom } from "../utils/socket/index.js"
import { validateIsUserIdeaAmbiguous } from "../utils/langchain/zeroToOne.js"
import ZeroToOne from "../models/ZeroToOne.js"
import jwt from "jsonwebtoken"

const zeroToOne = async (req, res) => {
  const socketId = req.headers["socket-id"]

  try {
    const { input, token } = req.body
    let userId

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      userId = decoded.userId
    }

    const zeroToOneDoc = new ZeroToOne({
      input,
      user: userId,
    })

    verboseConsole(`[USER INPUT]: ${input}`, "cyan")
    const {
      response: validate,
      tokenUsage: validateTokenUsage,
    } = await validateIsUserIdeaAmbiguous(input)
    zeroToOneDoc.tokenUsage.push(validateTokenUsage)
    zeroToOneDoc.save()
    verboseConsole(`[VALIDATING]: Idea ambiguity`, "yellow")
    if (validate.isIdeaAmbiguous) {
      verboseConsole(
        `[RESULT]: Idea is ambiguous, check the recommendation`,
        "red"
      )
      emitUpdate(
        socketId,
        {
          message: AMBIGOUS_IDEA_MESSAGE,
          isIdeaAmbiguous: validate.isIdeaAmbiguous,
          recommendation: validate.recommendation,
        },
        "ambiguousIdea"
      )
      return
    }

    const room = `analysis-${zeroToOneDoc._id}`

    if (socketId) {
      joinRoom(socketId, room)
    }

    const { response, tokenUsage: queriesTokenUsage } = await generateQueries(
      input
    )
    const { queries } = response

    verboseConsole(`[QUERIES TO SEARCH IN SERPER]: ${queries}`, "blue")
    zeroToOneDoc.queries = queries.map(query => ({ query }))
    zeroToOneDoc.tokenUsage.push(queriesTokenUsage)
    emitUpdate(room, zeroToOneDoc)

    for (let index = 0; index < queries.length; index++) {
      const query = queries[index]
      verboseConsole(`[SEARCHING QUERY]: ${query}`, "purple")
      zeroToOneDoc.queries[index].status = STATUS_TYPES.SEARCHING
      emitUpdate(room, zeroToOneDoc)

      try {
        const internetSearchResults = await makeSerperRequest(query)
        verboseConsole("[STARTING ANALYSIS OF INTERNET RESULTS]:", "pink")

        for (const result of internetSearchResults) {
          const {
            response: searchAnalysisResult,
            tokenUsage: searchResultTokenUsage,
          } = await generateSearchResultAnalysis(input, result)

          zeroToOneDoc.tokenUsage.push(searchResultTokenUsage)
          if (searchAnalysisResult.isProjectOrCompany) {
            verboseConsole(
              `[FOUND PROJECT OR COMPANY]: ${result.title} url: ${result.link}`,
              "green"
            )

            zeroToOneDoc.queries[index].results.push({
              ...result,
              analysis: searchAnalysisResult,
            })
          }
          emitUpdate(room, zeroToOneDoc)
        }
      } finally {
        zeroToOneDoc.queries[index].status = STATUS_TYPES.COMPLETED
        emitUpdate(room, zeroToOneDoc)
      }
    }

    // Final analysis
    const {
      response: finalAnalysis,
      tokenUsage: finalAnalysisTokenUsage,
    } = await generateFinalAnalysis(
      input,
      zeroToOneDoc.queries.map(query => ({
        results: query.results.map(result => ({
          title: result.title,
          snippet: result.snippet,
        })),
      }))
    )

    zeroToOneDoc.finalAnalysis = finalAnalysis
    zeroToOneDoc.tokenUsage.push(finalAnalysisTokenUsage)
    emitUpdate(room, zeroToOneDoc)

    await zeroToOneDoc.save()
    res.status(200).json({
      success: true,
      data: zeroToOneDoc,
      room,
    })
  } catch (err) {
    console.log(err)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: err,
      })
    }
  }
}

export default zeroToOne
