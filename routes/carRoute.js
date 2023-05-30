const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.post('/', carController.createCar);
router.get('/filters', carController.filterInfo);
router.get('/', carController.getAllCars);
router.get('/:carId', carController.getCarById);
router.put('/:carId', carController.updateCar);

router.delete('/:carId', carController.deleteCar);
router.get('/available', carController.getAvailableCars);
router.get('/type/:carType', carController.getCarsByType);
router.get('/brand/:carBrand', carController.getCarsByBrand);
router.get('/capacity/:maxPeople', carController.getCarsByMaxCapacity);
router.get('/doors/:numDoors', carController.getCarsByNumDoors);
router.get('/price', carController.getCarsByPriceRange);
router.get('/discounted', carController.getDiscountedCars);
router.get('/year/:carYear', carController.getCarsByYear);
router.get('/:carId/availability', carController.checkCarAvailability);
router.put('/:carId/availability', carController.updateCarAvailability);
router.put('/:carId/discount', carController.applyDiscountToCar);
router.put('/:carId/discount', carController.applyDiscountToCar);
router.post('/:carId/reviews', carController.createReview);
router.get('/:carId/reviews', carController.getAllReview);

module.exports = router;
