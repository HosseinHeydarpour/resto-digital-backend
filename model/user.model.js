const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bycrypt = require("bcryptjs");

const crypto = require("crypto");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is a required field."],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is a required field."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is a required field."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is a required field."],
    select: false, // don't return password with user object
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is a required field."],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password confirm must match password.",
    },
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is a required field."],
    trim: true,
    unique: true,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    default: null,
  },
  role: {
    type: String,
    enum: ["owner", "staff", "customer"],
    default: "customer",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  //only run if password is modified
  if (!this.isModified("password")) return next;

  this.password = await bycrypt.hash(this.password, 12);

  // remove password cinfirm just before saving
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash reset token and den save into db
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
