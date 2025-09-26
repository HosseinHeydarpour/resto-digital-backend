const mongoose = require("mongoose");
const dotEnv = require("dotenv");

dotEnv.config({
  path: "./config.env",
});

const app = require("./app");

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
  .then(() => console.log("✅ DB connection successful"));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port : ${port} ✅`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
