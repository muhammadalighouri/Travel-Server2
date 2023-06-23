const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/all', authorizeRoles('admin'), bookingController.getAllBookingsByAdmin);
router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getAllBookings);
router.post('/accept/:id', authorizeRoles('admin'), bookingController.acceptBooking);
router.post('/confirm/:id', authorizeRoles('admin'), bookingController.confirmBooking);
router.post('/cancel/:id', authorizeRoles('admin'), bookingController.cancelBooking);
router.post('/complete/:id', authorizeRoles('admin'), bookingController.completeBooking);


module.exports = router;
