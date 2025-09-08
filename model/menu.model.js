const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = require("./category.schema"); // Import the category schema

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Menu name is required."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    categories: [categorySchema], // Embed the category schema as an array
  },
  {
    timestamps: true,
  }
);

module.exports = menuSchema;
