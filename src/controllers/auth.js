import { User } from "../models/User.js"
import jwt from "jsonwebtoken"
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js"
import verboseConsole from "../utils/console/verboseConsole.js"

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid login credentials" })
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify your email first" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    user.tokens = user.tokens.concat({ token })
    await user.save()

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ error: "Error logging in" })
  }
}

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      })
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    })

    // Generate verification token
    const verificationToken = user.generateVerificationToken()

    // Save user
    await user.save()
    verboseConsole(`[USER REGISTERED]: ${email}`, "green")

    // Send verification email
    console.log("sending email")
    await sendVerificationEmail(email, verificationToken)
    verboseConsole(`[VERIFICATION EMAIL SENT]: ${email}`, "green")

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: false,
        },
        token,
        message: "Verification email has been sent to your email address",
      },
    })
  } catch (error) {
    verboseConsole(`[REGISTRATION ERROR]: ${error}`, "red")
    res.status(500).json({
      success: false,
      error: "Error registering user",
    })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" })
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    res.json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ error: "Error verifying email" })
  }
}

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const resetToken = user.generatePasswordResetToken()
    await user.save()

    await sendPasswordResetEmail(user.email, resetToken)

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    res.status(500).json({ error: "Error requesting password reset" })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" })
  }
}
