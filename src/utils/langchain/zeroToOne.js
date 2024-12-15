import { chatCompletionWithTokenUsage } from "./chatCompletion.js"
import {
  searchQueryCreationPrompt,
  queryValidateProjectOrCompanyPrompt,
  finalAnalysisPrompt,
  isUserIdeaAmibguousPrompt,
} from "./prompts.js"

export const generateQueries = async (input, source) => {
  const amountOfQueries = process.env.AMOUNT_OF_QUERIES || 5
  const response = await chatCompletionWithTokenUsage(
    searchQueryCreationPrompt,
    `${input} IMPORTANT JSON FORMAT: {queries: []} max amount ${amountOfQueries}`,
    source
  )
  return response
}

export const generateSearchResultAnalysis = async (query, result, source) => {
  const response = await chatCompletionWithTokenUsage(
    queryValidateProjectOrCompanyPrompt,
    `user input: ${query} search title: ${result.title} search snippet: ${result.snippet} JSON FORMAT: {isProjectOrCompany: true | false, description: 'description of the result', insights: 'insights of the result'}Discard stuff thats to ideas discussion, blog posts, or anything that is not a project or company.`,
    source
  )
  return response
}

export const generateFinalAnalysis = async (input, queries, source) => {
  const response = await chatCompletionWithTokenUsage(
    finalAnalysisPrompt,
    `
      User input: ${input}
      Search results: ${JSON.stringify(queries)}
      JSON FORMAT: {uniqueness: 1-100, description: 'description of the results', recommendations: 'recommendations for the user'}`,
    source
  )
  return response
}

export const validateIsUserIdeaAmbiguous = async (input, source) => {
  const isAmbiguousVarName = "isIdeaAmbiguous"
  const response = await chatCompletionWithTokenUsage(
    isUserIdeaAmibguousPrompt,
    ` User idea: ${input} !IMPORTANT json FORMAT: {${isAmbiguousVarName}: boolean, recommendation: String}`,
    source
  )
  return response
}
