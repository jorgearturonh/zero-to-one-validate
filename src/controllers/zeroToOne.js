import {
  generateFinalAnalysis,
  generateQueries,
  generateSearchResultAnalysis,
} from "../utils/langchain/index.js"
import makeSerperRequest from "../utils/serper/index.js"
import { endStream, initStream, updateStream } from "../utils/stream/index.js"
import { STATUS_TYPES } from "../consts/index.js"
import verboseConsole from "../utils/console/verboseConsole.js"

const zeroToOne = async (req, res) => {
  const stream = initStream(res)
  try {
    const { input } = req.body
    const zeroToOneDoc = req.zeroToOneDoc
    const { response, tokenUsage: queriesTokenUsage } = await generateQueries(
      input,
      zeroToOneDoc._id
    )
    const { queries } = response
    verboseConsole(`[QUERIES TO SEARCH IN SERPER]: ${queries}`, "blue")
    zeroToOneDoc.queries = queries.map(query => ({ query }))
    zeroToOneDoc.tokenUsage.push(queriesTokenUsage)
    updateStream(stream, zeroToOneDoc)
    for (let index = 0; index < queries.length; index++) {
      const query = queries[index]
      verboseConsole(`[SEARCHING QUERY]: ${query}`, "purple")
      zeroToOneDoc.queries[index].status = STATUS_TYPES.SEARCHING
      updateStream(stream, zeroToOneDoc)
      try {
        const internetSearchResults = await makeSerperRequest(query)
        verboseConsole("[STARTING ANALYSIS OF INTERNET RESULTS]:", "pink")
        for (const result of internetSearchResults) {
          const {
            response: searchAnalysisResult,
            tokenUsage: searchResultTokenUsage,
          } = await generateSearchResultAnalysis(
            input,
            result,
            zeroToOneDoc._id
          )
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
          updateStream(stream, zeroToOneDoc)
        }
      } finally {
        zeroToOneDoc.queries[index].status = STATUS_TYPES.COMPLETED
        updateStream(stream, zeroToOneDoc)
      }
    }
    verboseConsole("[GENERATING FINAL ANALYSIS]: ...", "green")
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
      })),
      zeroToOneDoc._id
    )
    zeroToOneDoc.finalAnalysis = finalAnalysis
    zeroToOneDoc.tokenUsage.push(finalAnalysisTokenUsage)
    verboseConsole(
      `[FINAL ANALYSIS GENERATED]: \nUniqueness: ${zeroToOneDoc.finalAnalysis.uniqueness} \nDescription: ${zeroToOneDoc.finalAnalysis.description} \nRecommendations: ${zeroToOneDoc.finalAnalysis.recommendations}`,
      "purple"
    )
    updateStream(stream, zeroToOneDoc)
    endStream(stream)

    zeroToOneDoc.save()
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        data: zeroToOneDoc,
      })
    }
  } catch (err) {
    console.log(err)
    endStream(stream)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: err,
      })
    }
  }
}

export default zeroToOne
