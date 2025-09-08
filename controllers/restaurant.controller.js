const Restaurant = require("../model/restaurant.model");
const catchAsync = require("../utlis/catchAsync");

exports.getRestaurantInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    $or: [{ owner: id }, { staff: id }],
  });

  res.status(200).json({
    status: "success",
    data: { restaurant },
  });
});
