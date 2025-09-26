const User = require("../model/user.model");
const catchAsync = require("../utlis/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    staus: "success",
    data: {
      user: newUser,
    },
  });
});
