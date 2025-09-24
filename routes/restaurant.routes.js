const express = require("express");

const router = express.Router();

const restaurantController = require("../controllers/restaurant.controller");

router.route("/").get(restaurantController.getAllRestaurants);

router.route("/:id").get(restaurantController.getRestaurantInfo);

module.exports = router;
