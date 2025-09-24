const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is a required field."],
      trim: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "owner",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
