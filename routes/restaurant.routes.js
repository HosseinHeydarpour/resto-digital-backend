const express = require("express");

const router = express.router;

const restaurantController = require("../controllers/restaurant.controller");

router.route("/:id").get();
