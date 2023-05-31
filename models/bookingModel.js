const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pickupLocation: {
        state: String,
        city: String
    },
    returnLocation: {
        state: String,
        city: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rate: {
        type: String,
        enum: ['per_day', 'per_month']
    },
    addons: [{
        type: String,
        enum: ['child_seat', 'full_insurance', 'open_discount']
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
