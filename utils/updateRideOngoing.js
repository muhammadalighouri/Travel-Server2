const mongoose = require("mongoose");
const cron = require("node-cron");
const Booking = require('../models/bookingModel');

// your bookingSchema here...
const checkBookingEndDatesOngoing = () => {
    // Schedule task that runs every minute
    cron.schedule('* * * * *', () => {
        console.log('Running a task every minute');

        let now = new Date();

        // Find bookings where start date is less than or equal to the current time and rideStatus is 'upcoming'
        Booking.updateMany({
            startDate: { $lte: now },
            rideStatus: 'upcoming'
        }, {
            $set: { rideStatus: 'ongoing' } // Update rideStatus to 'ongoing'
        }, (err, docs) => {
            if (err) {
                console.log('Error in updating bookings:', err);
            } else {
                console.log('Updated bookings:');
            }
        });
    });
};



module.exports = checkBookingEndDatesOngoing;
