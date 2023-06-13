const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        pickupLocation: {
            state: String,
            city: String,
        },
        returnLocation: {
            state: String,
            city: String,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        delivery: {
            type: Boolean,
            default: false,
        },
        addons: [
            {
                type: String,
                enum: ["child_seat", "full_insurance", "open_discount"],
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        isContract: {
            type: Boolean,
            default: false,
        },

        rideStatus: {
            type: String,
            enum: ["processing", "running", "completed", "cancelled"],
            default: "processing",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
