const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
// const User = require("../model/user.model");
const Restaurant = require("../model/restaurant.model");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB connection Successful"));

const restaurants = JSON.parse(
  fs.readFileSync(`${__dirname}/restaurantData.json`, "utf-8")
);

const importData = async () => {
  try {
    await Restaurant.create(restaurants);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv); to check what are args and decide on the next lines of code

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
