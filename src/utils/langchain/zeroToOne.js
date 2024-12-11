import chatOpenAICompletion from "./chatCompletion.js"
import {
  searchQueryCreationPrompt,
  queryValidateProjectOrCompanyPrompt,
  finalAnalysisPrompt,
  isUserIdeaAmibguousPrompt,
} from "./prompts.js"

export const generateQueries = async input => {
  const amountOfQueries = process.env.AMOUNT_OF_QUERIES || 5
  const { response } = await chatOpenAICompletion(
    searchQueryCreationPrompt,
    `${input} !IMPORTANT JSON FORMAT: {queries: []} max amount ${amountOfQueries}`
  )
  return JSON.parse(response).queries
}

export const generateSearchResultAnalysis = async (query, result) => {
  const { response } = await chatOpenAICompletion(
    queryValidateProjectOrCompanyPrompt,
    `user input: ${query} search: ${result.title} ${result.snippet} JSON FORMAT: {isProjectOrCompany: true | false, description: 'description of the result', insights: 'insights of the result'}`
  )
  return JSON.parse(response)
}

export const generateFinalAnalysis = async (input, queries) => {
  const { response } = await chatOpenAICompletion(
    finalAnalysisPrompt,
    `
      User input: ${input}
      Search results: ${JSON.stringify(queries)}
      JSON FORMAT: {uniqueness: 1-100, description: 'description of the results', recommendations: 'recommendations for the user'}`
  )
  return JSON.parse(response)
}

export const validateIsUserIdeaAmbiguous = async input => {
  const isAmbiguousVarName = "isIdeaAmbiguous"
  const { response } = await chatOpenAICompletion(
    isUserIdeaAmibguousPrompt,
    ` User idea: ${input} 
    !IMPORTANT JSON FORMAT: {${isAmbiguousVarName}: boolean, recommendation: String}`
  )
  return JSON.parse(response)
}
