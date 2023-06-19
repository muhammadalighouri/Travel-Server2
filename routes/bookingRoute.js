const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/all', bookingController.getAllBookingsByAdmin);
router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getAllBookings);
router.post('/accept/:id', bookingController.acceptBooking);
router.post('/confirm/:id', bookingController.confirmBooking);
router.post('/cancel/:id', bookingController.cancelBooking);
router.post('/complete/:id', bookingController.completeBooking);


module.exports = router;
