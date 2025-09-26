const express = require("express");

const morgan = require("morgan");

const cors = require("cors");

const AppError = require("./utlis/appError");
const globalErrorHandler = require("./controllers/error.controller");
const restaurantRouter = require("./routes/restaurant.routes");
const userRouter = require("./routes/user.routes");

const app = express();

// Allow all origins
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// =========================
// **** Route Handlers ****
// =========================
app.use("/api/v1/restaurants", restaurantRouter);

app.use("/api/v1/users", userRouter);

// Handle all other routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this sever`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
