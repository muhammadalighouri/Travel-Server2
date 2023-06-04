const cron = require("node-cron");
const Booking = require("../models/bookingModel");


const checkBookingEndDatesTwo = () => {
    // Run the job every day at 00:00

    cron.schedule("* * * * *", async function () {
        console.log("Running check on booking status");
        const now = new Date();
        const bookings = await Booking.find({
            endDate: { $lt: now },
            rideStatus: "pending",
        });

        bookings.forEach(async (booking) => {
            booking.rideStatus = "completed";
            await booking.save();
        });
    });
};

module.exports = checkBookingEndDatesTwo;
