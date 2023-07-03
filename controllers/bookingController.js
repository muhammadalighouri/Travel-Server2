const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const { carId, user, address, pickupLocation, returnLocation, startDate, endDate, totalPrice, currency } = req.body;

        const booking = new Booking({
            car: carId,
            user,
            address,
            pickupLocation,
            returnLocation,
            startDate,
            endDate,
            totalPrice,
            currency,
        });

        await booking.save();
        // Set availability of the car to false upon booking
        const carToUpdate = await Car.findById(carId);
        carToUpdate.availability = false;
        await carToUpdate.save();
        // Set availability of the car to false upon booking

        res.status(201).send(carToUpdate);
    } catch (error) {
        res.status(400).send(error);
    }
};


// Get all bookings of a user
exports.getAllBookings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ user: userId })
            .populate("car")
            .populate("user");

        const bookingsByStatus = {
            processing: [],
            running: [],
            completed: [],
            cancelled: [],
            confirmed: [],
        };

        bookings.forEach((booking) => {
            bookingsByStatus[booking.rideStatus].push(booking);
        });

        res.send(bookingsByStatus);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("car")
            .populate("user");
        if (!booking) {
            return res.status(404).send();
        }
        res.send(booking);
    } catch (error) {
        res.status(500).send();
    }
};

// Update a booking
exports.updateBooking = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "pickupLocation",
        "returnLocation",
        "startDate",
        "endDate",
        "addons",
        "totalPrice",
        "paymentStatus",
    ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send();
        }
        updates.forEach((update) => (booking[update] = req.body[update]));
        await booking.save();
        res.send(booking);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        const car = await Car.findById(booking.car);
        car.availability = true;
        await car.save();
        if (!booking) {
            return res.status(404).send({ message: "booking not find" });
        }
        res.send(booking);
    } catch (error) {
        res.status(500).send({ message: "booking deleted!" });
    }
};
// admin controller

// Get all bookings for admin
exports.getAllBookingsByAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate("car").populate("user");

        res.send(bookings);
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        booking.isContract = true;
        booking.rideStatus = "running";
        await booking.save();
        res.send(booking);
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        booking.rideStatus = "confirmed";
        await booking.save();
        res.send(booking);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        const car = await Car.findById(booking.car);
        booking.rideStatus = "cancelled"
        car.availability = true;
        await booking.save()
        await car.save()
        res.send(booking);
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({ message: "Booking not found" });
        }
        const car = await Car.findById(booking.car);

        booking.rideStatus = "completed"
        car.availability = true;
        await booking.save()
        await car.save()
        res.send(booking);
    } catch (error) {
        res.status(500).send(error);
    }
};
