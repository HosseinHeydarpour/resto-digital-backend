const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Item price is required."],
      min: [0, "Price cannot be negative."],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps to each item
  }
);

module.exports = itemSchema;
