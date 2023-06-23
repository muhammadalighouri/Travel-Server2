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
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    pricePerMonth: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    year: { type: Number, required: true },
    model: { type: String, required: true },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    branch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }]

});

const Car = mongoose.model("Car", carSchema);

module.exports = {
    Car,
    Review
};
