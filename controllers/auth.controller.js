const utils = require("util");

const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const AppError = require("../utlis/appError");

const catchAsync = require("../utlis/catchAsync");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    mobileNumber: req.body.mobileNumber,
  };

  if (req.body.passwordChangedAt) {
    userData.passwordChangedAt = req.body.passwordChangedAt;
  }

  const newUser = await User.create(userData);

  const token = signToken(newUser._id);

  res.status(201).json({
    staus: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  console.log(req.body);

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login to get access", 401));
  }

  // Validate token
  const decoded = await utils.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // If User exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists")
    );
  }

  // if user changed password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again!", 401)
    );
  }

  req.user = currentUser;

  next();
});
