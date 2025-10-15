const utils = require("util");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const AppError = require("../utlis/appError");

const catchAsync = require("../utlis/catchAsync");

const sendEmail = require("../utlis/email");

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
    role: req.body.role,
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

exports.restrictTo = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  next();
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the email
  const user = await User.findOne({
    email: req.body.email,
  });

  console.log(user);
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token send to the mail",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(error);
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
