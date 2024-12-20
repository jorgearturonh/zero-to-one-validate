import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    zeroToOneValidations: [
      {
        type: Schema.Types.ObjectId,
        ref: "ZeroToOneValidate",
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
  const verificationToken = crypto.randomBytes(32).toString("hex")
  this.verificationToken = verificationToken
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return verificationToken
}

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.resetPasswordToken = resetToken
  this.resetPasswordExpires = Date.now() + 3600000 // 1 hour
  return resetToken
}

export const User = mongoose.model("User", UserSchema)
