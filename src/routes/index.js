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
import { getUserQueries } from "../controllers/getUserSearches.js"
import { getUserQuery } from "../controllers/getUserSearch.js"
import rateLimit from "express-rate-limit"

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many attempts, please try again later",
})

const router = express.Router()

router.post("/idea-iterator", generateIdeaIterator)
router.post("/feedback", feedback)

// Get all queries for authenticated user
router.get("/queries", auth, getUserQueries)
router.get("/queries/:id", auth, getUserQuery)

// Auth routes
router.post("/auth/register", registerUser)
router.post("/auth/login", authLimiter, login)
router.get("/auth/verify/:token", verifyEmail)
router.post("/auth/password-reset-request", requestPasswordReset)
router.post("/auth/password-reset", resetPassword)

export default router
