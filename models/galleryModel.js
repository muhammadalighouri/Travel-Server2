const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
});

module.exports = mongoose.model('Gallery', GallerySchema);
