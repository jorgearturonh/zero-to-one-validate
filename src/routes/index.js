import express from "express"

import zeroToOne from "../controllers/zeroToOne.js"
import isUserIdeaAmibgous from "../middlewares/isUserIdeaAmbigous.js"

const router = express.Router()

router.post("/", isUserIdeaAmibgous, zeroToOne)

export default router
