const express = require("express");

const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const restaurantRouter = require("./routes/restaurant.routes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// =========================
// **** Route Handlers ****
// =========================
app.use("/api/v1/restaurants", restaurantRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this sever`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
