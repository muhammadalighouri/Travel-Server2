const Slide = require("../models/slideModel");
const cloudinary = require("cloudinary");

exports.getSlides = async (req, res) => {
    try {
        const slides = await Slide.find({});

        res.status(201).json(slides);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

exports.createSlide = async (req, res) => {
    try {
        const { title, image } = req.body;

        const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "slides",
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

        const slide = await Slide.create(slideData);

        res.status(201).json(slide);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.deleteSlide = async (req, res) => {
    try {
        const slide = await Slide.findByIdAndDelete(req.params.id);
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
exports.updateSlide = async (req, res) => {
    try {
        const { title, image } = req.body;

        const slideData = {
            title: title,
        };
        if (req.body.image) {
            const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
                folder: "slides",
                width: 150,
                crop: "scale",
            });
            slideData.image = {
                public_id: imageUploadResult.public_id,
                url: imageUploadResult.secure_url,
            };
        }

        const updatedSlide = await Slide.findByIdAndUpdate(
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
