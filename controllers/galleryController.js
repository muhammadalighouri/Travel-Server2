const Gallery = require("../models/galleryModel");
const cloudinary = require("cloudinary");

exports.getGallery = async (req, res) => {
    try {
        const images = await Gallery.find({});

        res.status(201).json(images);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

exports.createGallery = async (req, res) => {
    try {
        const { title, image } = req.body;

        const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "Gallery",
            width: 150,
            crop: "scale",
        });

        const slideData = {
            title: title,
            image: {
                public_id: imageUploadResult.public_id,
                url: imageUploadResult.secure_url,
            },
        };

        const GalleryImage = await Gallery.create(slideData);

        res.status(201).json(GalleryImage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.deleteGallery = async (req, res) => {
    try {
        const slide = await Gallery.findByIdAndDelete(req.params.id);
        if (slide) {
            res.json({ status: "success", message: "Car deleted successfully" });
        } else {
            res.status(404).json({ status: "error", message: "Car not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.updateGallery = async (req, res) => {
    try {
        const { title, image } = req.body;

        const slideData = {
            title: title,
        };
        if (req.body.image) {
            const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
                folder: "Gallery",
                width: 150,
                crop: "scale",
            });
            slideData.image = {
                public_id: imageUploadResult.public_id,
                url: imageUploadResult.secure_url,
            };
        }

        const updatedSlide = await Gallery.findByIdAndUpdate(
            req.params.id,
            slideData,
            { new: true }
        );
        res.status(201).json(updatedSlide);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
