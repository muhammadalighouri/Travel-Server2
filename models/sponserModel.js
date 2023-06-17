const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
});

module.exports = mongoose.model('Sponsor', SponsorSchema);
