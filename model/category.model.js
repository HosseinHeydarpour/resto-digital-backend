const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = require("./menuItem.model"); // Import the item schema

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      // You can add more categories here as needed
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Cafe",
        "Special",
        "Hookah",
        "Appetizers",
        "Desserts",
        "Beverages",
      ],
    },
    items: [itemSchema], // Embed the item schema as an array
  },
  {
    timestamps: true,
  }
);

module.exports = categorySchema;
