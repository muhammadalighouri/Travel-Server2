const Booking = require('../models/bookingModel');

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('car').populate('user');
        res.send(bookings);
    } catch (error) {
        res.status(500).send();
    }
};

// Get a single booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('car').populate('user');
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
    const allowedUpdates = ['pickupLocation', 'returnLocation', 'startDate', 'endDate', 'addons', 'totalPrice', 'paymentStatus'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send();
        }
        updates.forEach((update) => booking[update] = req.body[update]);
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
        if (!booking) {
            return res.status(404).send();
        }
        res.send(booking);
    } catch (error) {
        res.status(500).send();
    }
};
