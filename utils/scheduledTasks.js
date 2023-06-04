const cron = require("node-cron");
const Booking = require("../models/bookingModel");
const { Car } = require("../models/carModel");

const checkBookingEndDatesTwo = () => {
    cron.schedule("* * * * *", async () => {
        console.log("Running checkBookingEndDates...");
        const bookings = await Booking.find({});
        const currentDate = new Date();
        currentDate.setSeconds(0); // set the seconds to 0
        console.log("Current Date:", currentDate);

        bookings.forEach(async (booking) => {
            const bookingStartDate = new Date(booking.startDate);
            bookingStartDate.setSeconds(0); // set the seconds to 0
            console.log("Booking Start Date:", bookingStartDate);

            if (
                bookingStartDate <= currentDate &&
                booking.rideStatus === "upcoming"
            ) {
                const car = await Car.findById(booking.car);
                if (car) {
                    car.availability = false; // Set availability to false for ongoing booking
                    await car.save();
                    console.log("Car availability updated:", car.availability);
                }

                // Update the rideStatus of the booking to "ongoing"
                booking.rideStatus = "ongoing";
                await booking.save();
                console.log("Booking rideStatus updated:", booking.rideStatus);
            }
        });
    });
};

module.exports = checkBookingEndDatesTwo;
