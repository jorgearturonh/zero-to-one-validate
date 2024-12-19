import express from "express"
import { auth } from "../middleware/auth.js"
import { generateIdeaIterator } from "../controllers/ideaIterator.js"
import feedback from "../controllers/feedback.js"
import {
  registerUser,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.js"
import { getUserQueries } from "../controllers/queryController.js"

const router = express.Router()

router.post("/idea-iterator", generateIdeaIterator)
router.post("/feedback", feedback)

// Get all queries for authenticated user
router.get("/queries", auth, getUserQueries)

// Auth routes
router.post("/auth/register", registerUser)
router.post("/auth/login", login)
router.get("/auth/verify/:token", verifyEmail)
router.post("/auth/password-reset-request", requestPasswordReset)
router.post("/auth/password-reset", resetPassword)

export default router
