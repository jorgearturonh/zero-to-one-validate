import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import ms from "ms"

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    zeroToOneValidations: [
      {
        type: Schema.Types.ObjectId,
        ref: "ZeroToOneValidate",
      },
    ],
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Generate verification token
UserSchema.methods.generateVerificationToken = function() {
  const { token, hashedToken, expiresAt } = this.generateSecureToken(
    process.env.VERIFICATION_TOKEN_EXPIRY
  )

  this.verificationToken = hashedToken
  this.verificationTokenExpires = expiresAt

  return token
}

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
  const { token, hashedToken, expiresAt } = this.generateSecureToken(
    process.env.PASSWORD_RESET_EXPIRY
  )

  this.resetPasswordToken = hashedToken
  this.resetPasswordExpires = expiresAt

  return token
}

UserSchema.methods.generateSecureToken = function(expiryTime) {
  const token = crypto.randomBytes(32).toString("base64url")
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  return {
    token,
    hashedToken,
    expiresAt: new Date(Date.now() + ms(expiryTime)),
  }
}

export const User = mongoose.model("User", UserSchema)
