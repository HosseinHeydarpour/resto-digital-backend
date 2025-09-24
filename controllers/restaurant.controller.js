const Restaurant = require("../model/restaurant.model");
const catchAsync = require("../utlis/catchAsync");
const AppError = require("../utlis/appError");

exports.getRestaurantInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    $or: [{ owner: id }, { staff: id }],
  });

  // Return 404 if no restaurant found
  if (!restaurant) {
    return next(new AppError("No restaurant found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { restaurant },
  });
});
