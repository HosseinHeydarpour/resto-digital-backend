const User = require("../model/user.model");

const catchAsync = require("../utlis/catchAsync");

const jwt = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    mobileNumber: req.body.mobileNumber,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    staus: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});
