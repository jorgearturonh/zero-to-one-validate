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
    from: `"FindSimilarStartups.com" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Welcome to Find Similar Startups - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb; text-align: center;">Welcome to Find Similar Startups!</h1>
        
        <p style="font-size: 16px; line-height: 1.5;">We're excited to have you join our community of innovative founders and entrepreneurs. Your journey to validating groundbreaking startup ideas begins here.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">To get started and ensure the security of your account, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="font-size: 14px; color: #666;">${verificationUrl}</p>
        
        <hr style="border: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          Zero to One Validator - Helping you build something truly unique
        </p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${APP_URL}/reset-password/${token}`

  await transporter.sendMail({
    from: `"FindSimilarStartups.com" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Find Similar Startups Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb; text-align: center;">Password Reset Request</h1>
        
        <p style="font-size: 16px; line-height: 1.5;">We received a request to reset your Zero to One Validator password. If you didn't make this request, you can safely ignore this email.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">To reset your password, click the button below. This link will expire in 1 hour for security purposes.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="font-size: 14px; color: #666;">${resetUrl}</p>
        
        <hr style="border: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          For security reasons, this password reset link will expire in 1 hour.<br>
          If you need assistance, please contact our support team.
        </p>
      </div>
    `,
  })
}
