import express from "express"

import zeroToOne from "../controllers/zeroToOne.js"
import isUserIdeaAmibgous from "../middlewares/isUserIdeaAmbigous.js"
import { generateIdeaIterator } from "../controllers/ideaIterator.js"
import feedback from "../controllers/feedback.js"
const router = express.Router()

router.post("/", isUserIdeaAmibgous, zeroToOne)
router.post("/idea-iterator", generateIdeaIterator)
router.post("/feedback", feedback)

export default router
