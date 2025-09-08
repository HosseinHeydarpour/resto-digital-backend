const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is a required field."],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is a required field."],
      unique: true,
      trim: true,
    },
    landLine: [
      {
        type: String,
        unique: true,
        trim: true,
      },
    ],
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    socialMedia: [
      {
        type: String,
        trim: true,
      },
    ],
    workingHours: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
