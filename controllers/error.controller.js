const AppError = require("../utlis/appError");

const handleCastErrorDB = (err) => {
  // path is the name of the field, value is the problem we passed in
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Coding error
    console.log("Error ", err);
    res.status(500).json({
      status: "error",
      message: "Ooops! Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message; // copy message explicitly
    error.name = err.name; // copy name explicitly
    error.path = err.path; // copy path
    error.value = err.value; // copy value

    if (error.name === "CastError") error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
};
