const express = require("express");

const router = express.Router();

const restaurantController = require("../controllers/restaurant.controller");

const authController = require("../controllers/auth.controller");

router
  .route("/")
  .get(authController.protect, restaurantController.getAllRestaurants);

router.route("/:id").get(restaurantController.getRestaurantInfo);

module.exports = router;
