import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const APP_URL = process.env.APP_URL

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${APP_URL}/verify-email/${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `Please click <a href="${verificationUrl}">here</a> to verify your email.`,
  })
}

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${APP_URL}/reset-password/${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
  })
}
