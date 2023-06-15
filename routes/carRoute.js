const express = require("express");
const carController = require("../controllers/carController");
const { authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.get("/filters", carController.filterInfo);
router.post("/all", carController.getAllCars);

router.post("/:carId/reviews", carController.createReview);
// admin routes
router.post("/", authorizeRoles("admin"), carController.createCar);
router.post("/all/admin", authorizeRoles("admin"), carController.getAllCarsAdmin);
router.get(
    "/:carId/reviews",
    authorizeRoles("admin"),
    carController.getAllReview
);
router.put("/:carId", authorizeRoles("admin"), carController.updateCar);
router.post("/:carId/car", authorizeRoles("admin"), carController.getCarById);
router.post("/:carId", authorizeRoles("admin"), carController.deleteCar);
router.get("/available", carController.getAvailableCars);
module.exports = router;
