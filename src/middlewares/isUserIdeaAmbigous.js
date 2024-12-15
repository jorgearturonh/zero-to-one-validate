import {
  AMBIGOUS_IDEA_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../consts/index.js"
import verboseConsole from "../utils/console/verboseConsole.js"
import { validateIsUserIdeaAmbiguous } from "../utils/langchain/zeroToOne.js"
import ZeroToOne from "../models/ZeroToOne.js"

const isUserIdeaAmibguous = async (req, res, next) => {
  try {
    const { input } = req.body
    const zeroToOneDoc = new ZeroToOne({ input })
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
      return res.status(400).json({
        message: AMBIGOUS_IDEA_MESSAGE,
        isIdeaAmbiguous: validate.isIdeaAmbiguous,
        recommendation: validate.recommendation,
      })
    }
    req.zeroToOneDoc = zeroToOneDoc
    next()
  } catch (err) {
    console.error("Unexpected error in isUserIdeaAmbigous middleware", err)
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE })
  }
}

export default isUserIdeaAmibguous
