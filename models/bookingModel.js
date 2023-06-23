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
            type: String,
        },
        returnLocation: {
            type: String,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isDelivery: {
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
        currency: {
            type: String,
            default: 'SAR'
        },
        rate: {
            type: String,
            enum: ['perHour', "perDay", "perMonth"],
            default: "perDay",
        },
        hours: {
            type: Number,
            default: false,
        },
        days: {
            type: Number,
            default: false,
        },
        months: {
            type: Number,
            default: false,
        },
        isExtended: {
            type: Boolean,
            default: false,
        },
        extendedDate: {
            type: Boolean,
            default: false,
        },
        isContract: {
            type: Boolean,
            default: false,
        },


        rideStatus: {
            type: String,
            enum: ["processing", 'confirmed', "running", "completed", "cancelled"],
            default: "processing",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
