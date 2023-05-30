const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // you might already have a User model
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    mainImages: [{ type: String, required: true }],
    brand: { type: String, required: true },
    engine: { type: String, required: true },
    maxPeople: { type: Number, required: true },
    numDoors: { type: Number, required: true },
    bags: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    year: { type: Number, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Car = mongoose.model("Car", carSchema);

module.exports = {
    Car,
    Review
};
