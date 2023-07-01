// models/address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address: String,
    city: String,
    title: String,
    state: String,
    lat: Number,
    lng: Number,
    postalCode: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model('Address', addressSchema);
