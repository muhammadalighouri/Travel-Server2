const mongoose = require("mongoose");




const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    brand: { type: String, required: true },
    engine: { type: String, required: true },
    maxPeople: { type: Number, required: true },
    numDoors: { type: Number, required: true },
    airCondition: { type: Boolean, required: true },
    bags: { type: Number, required: true },
    seats: { type: Number, required: true },
    doors: { type: Number, required: true },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    pricePerMonth: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    year: { type: Number, required: true },
    model: { type: String, required: true },

    branch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
});

module.exports = mongoose.model("Car", carSchema);