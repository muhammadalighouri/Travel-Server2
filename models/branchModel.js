const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },

    branchNumber: {
        type: String,
    },
    branchMobile: {
        type: String,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },

    timings: {
        weekdays: {
            type: String,
            // required: [true, "Please enter the timings for weekdays (Mon to Thu)"],
        },
        weekends: {
            type: String,
            // required: [true, "Please enter the timings for weekends (Fri to Sun)"],
        },
    },
    cars: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
        },
    ],
});

module.exports = mongoose.model("Branch", branchSchema);
