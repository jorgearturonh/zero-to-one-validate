import { ChatOpenAI } from "@langchain/openai"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts"
import { chatOpenAiConfig } from "../../consts/config.js"
import {
  RATE_LIMIT_ERROR_CODE,
  RATE_LIMIT_ERROR_MESSAGE,
} from "../../consts/index.js"

const DEFAULT_MODEL = "gpt-4o-mini"

const chatOpenAICompletion = async (
  systemPrompt,
  input,
  temperature = 1,
  maxTokens,
  model = DEFAULT_MODEL
) => {
  try {
    const llm = new ChatOpenAI({
      ...chatOpenAiConfig,
      temperature,
      maxTokens,
      model,
    }).bind({
      response_format: {
        type: "json_object",
      },
    })

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ])

    const chain = prompt.pipe(llm)

    const chainCall = await chain.invoke({ input })
    return { ...chainCall, model }
  } catch (e) {
    if (e.code === RATE_LIMIT_ERROR_CODE) {
      console.error(RATE_LIMIT_ERROR_MESSAGE)
    }
    console.log(e)
    throw e
  }
}

export const chatCompletionWithTokenUsage = async (systemPrompt, input) => {
  const { content, response_metadata, model } = await chatOpenAICompletion(
    systemPrompt,
    input
  )
  const tokenUsage = {
    tokenUsage: {
      ...response_metadata.tokenUsage,
    },
    model,
  }
  return { response: JSON.parse(content), tokenUsage }
}

export default chatOpenAICompletion
