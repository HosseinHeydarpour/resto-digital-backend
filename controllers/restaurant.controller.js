const Restaurant = require("../model/restaurant.model");
const catchAsync = require("../utlis/catchAsync");

exports.getRestaurantInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({
    $or: [{ owner: userId }, { staff: userId }],
  });

  if (!restaurant) {
    return res.status(404).json({
      status: "fail",
      message: "رستورانی برای این کاربر پیدا نشد.",
    });
  }

  res.status(200).json({
    status: "success",
    data: { restaurant },
  });
});
