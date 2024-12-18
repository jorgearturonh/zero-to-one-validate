import express from "express"

import { generateIdeaIterator } from "../controllers/ideaIterator.js"
import feedback from "../controllers/feedback.js"
const router = express.Router()

router.post("/idea-iterator", generateIdeaIterator)
router.post("/feedback", feedback)

export default router
