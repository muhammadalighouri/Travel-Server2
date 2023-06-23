const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the branch name"],
    },
    address: {
        type: String,
        required: [true, "Please enter the branch address"],
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    timings: {
        weekdays: {
            type: String,
            required: [true, "Please enter the timings for weekdays (Mon to Thu)"],
        },
        weekends: {
            type: String,
            required: [true, "Please enter the timings for weekends (Fri to Sun)"],
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
