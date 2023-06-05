const cron = require("node-cron");
const Booking = require("../models/bookingModel");
const { Car } = require("../models/carModel");

const checkBookingEndDates = () => {
    cron.schedule("* * * * *", async () => {
        console.log("Running checkBookingEndDates...");
        const bookings = await Booking.find({});
        const currentDate = new Date();
        currentDate.setSeconds(0); // set the seconds to 0
        console.log("Current Date:", currentDate);
        bookings.forEach(async (booking) => {
            const bookingEndDate = new Date(booking.endDate);
            bookingEndDate.setSeconds(0); // set the seconds to 0
            console.log("Booking End Date:", bookingEndDate);
            if (bookingEndDate <= currentDate) {
                const car = await Car.findById(booking.car);
                if (car) {
                    car.availability = true;
                    await car.save();
                    console.log("Car availability updated:", car.availability);
                }

                // Update the rideStatus of the booking
                booking.rideStatus = "completed";
                await booking.save();
                console.log("Booking rideStatus updated:", booking.rideStatus);
            }
        });
    });
};

module.exports = checkBookingEndDates;
