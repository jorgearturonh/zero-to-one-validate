import {
  AMBIGOUS_IDEA_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../consts/index.js"
import verboseConsole from "../utils/console/verboseConsole.js"
import { validateIsUserIdeaAmbiguous } from "../utils/langchain/zeroToOne.js"

const isUserIdeaAmibguous = async (req, res, next) => {
  try {
    const { input } = req.body
    verboseConsole(`[USER INPUT]: ${input}`, "cyan")
    const validate = await validateIsUserIdeaAmbiguous(input)
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
    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE })
  }
}

export default isUserIdeaAmibguous
