const Sponsor = require("../models/sponserModel");
const cloudinary = require("cloudinary");

exports.getSponsor = async (req, res) => {
  try {
    const slides = await Sponsor.find({});

    res.status(201).json(slides);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.createSponsor = async (req, res) => {
  try {
    const { title, image } = req.body;

    const imageUploadResult = await cloudinary.v2.uploader.upload(image, {
      folder: "Sponsor",
      width: 550,
      crop: "scale",
    });

    const slideData = {
      title: title,
      image: {
        public_id: imageUploadResult.public_id,
        url: imageUploadResult.secure_url,
      },
    };

    const sponsor = await Sponsor.create(slideData);

    res.status(201).json(sponsor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.deleteSponsor = async (req, res) => {
  try {
    const slide = await Sponsor.findByIdAndDelete(req.params.id);
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
exports.updateSponsor = async (req, res) => {
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

    const updatedSlide = await Sponsor.findByIdAndUpdate(
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
