import { ChatOpenAI } from "@langchain/openai"
import { ConversationChain } from "langchain/chains"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts"
import { chatOpenAiConfig } from "../../consts/config.js"
import {
  RATE_LIMIT_ERROR_CODE,
  RATE_LIMIT_ERROR_MESSAGE,
} from "../../consts/index.js"

const chatOpenAICompletion = async (
  systemPrompt,
  input,
  temperature = 1,
  maxTokens
) => {
  try {
    const llm = new ChatOpenAI({
      ...chatOpenAiConfig,
      temperature,
      maxTokens,
    }).bind({
      response_format: {
        type: "json_object",
      },
    })
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ])

    const chain = new ConversationChain({
      llm,
      prompt,
    })

    const chainCall = await chain.call({ input }).catch(e => console.error(e))
    return chainCall
  } catch (e) {
    if (e.code === RATE_LIMIT_ERROR_CODE) {
      console.error(RATE_LIMIT_ERROR_MESSAGE)
    }
    console.log(e)
    throw e
  }
}

export default chatOpenAICompletion
