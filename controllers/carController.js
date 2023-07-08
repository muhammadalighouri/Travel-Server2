const Car = require("../models/carModel");
const User = require("../models/userModel");
const cloudinary = require('cloudinary');
const convertCurrency = require('../utils/currencyConverter');
const filterInfo = async (req, res) => {
    try {
        // Categories with counts
        const categoryCounts = await Car.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        // Brands with counts
        const brandCounts = await Car.aggregate([
            { $group: { _id: "$brand", count: { $sum: 1 } } },
        ]);

        // Models (types) with counts
        const modelCounts = await Car.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);

        // Price range
        const minPrice = await Car.find()
            .sort({ pricePerDay: 1 })
            .limit(1)
            .select("pricePerDay");
        const maxPrice = await Car.find()
            .sort({ pricePerDay: -1 })
            .limit(1)
            .select("pricePerDay");

        // Number of available cars
        const availableCarsCount = await Car.countDocuments({
            availability: true,
        });

        // Number of unavailable cars
        const unavailableCarsCount = await Car.countDocuments({
            availability: false,
        });

        res.json({
            categories: {
                name: "categories",
                data: categoryCounts,
            },
            brands: {
                name: "brands",
                data: brandCounts,
            },
            models: {
                name: "models",
                data: modelCounts,
            },
            priceRange: {
                name: "priceRange",
                data: {
                    min: minPrice[0]?.pricePerDay || 0,
                    max: maxPrice[0]?.pricePerDay || 0,
                },
            },
            availabilityCount: {
                name: "availabilityCount",
                data: {
                    available: availableCarsCount,
                    unavailable: unavailableCarsCount,
                },
            },
        });
    } catch (error) {
        res.status(500).send({
            message: "An error occurred while fetching the filter data",
            error: error.message,
        });
    }
};
// Post a review for a car
const createReview = async (req, res) => {
    const { carId } = req.params;
    const { userId, rating, comment } = req.body; // assuming you're getting userId from the client

    // Find the car
    const car = await cartModels.Car.findById(carId);
    if (!car) {
        return res.status(404).json({ message: "Car not found" });
    }

    // Create a new review
    const review = new cartModels.Review({
        user: userId,
        rating,
        comment,
    });

    // Save the review
    await review.save();

    // Add the review to the car's reviews
    car.reviews.push(review._id);

    // Recalculate the car's rating
    const reviews = await cartModels.Review.find({
        _id: { $in: car.reviews },
    }).exec();
    const totalRating = reviews.reduce(
        (total, review) => total + review.rating,
        0
    );
    car.rating = totalRating / reviews.length;

    // Save the car
    await car.save();

    res.json({
        status: "success",
        message: "Review added successfully",
        review: review,
    });
};

// Get all cars
// Get all cars

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const filter = { availability: true };
        const limit = 10; // Set default limit to 10
        const page = parseInt(req.query.page) || 1;

        // Apply filters based on request query parameters
        if (req.query.carType) {
            filter.type = req.query.carType;
        }

        if (req.query.carBrand) {
            const brands = req.query.carBrand.split(",");
            filter.brand = { $in: brands };
        }

        if (req.query.maxPeople) {
            filter.maxPeople = parseInt(req.query.maxPeople);
        }

        if (req.query.numDoors) {
            filter.numDoors = parseInt(req.query.numDoors);
        }

        if (req.query.category) {
            const categories = req.query.category.split(",");
            filter.category = { $in: categories };
        }

        if (req.query.minPricePerDay && req.query.maxPricePerDay) {
            filter.pricePerDay = {
                $gte: parseInt(req.query.minPricePerDay),
                $lte: parseInt(req.query.maxPricePerDay),
            };
        }

        if (req.query.minPricePerHour && req.query.maxPricePerHour) {
            filter.pricePerHour = {
                $gte: parseInt(req.query.minPricePerHour),
                $lte: parseInt(req.query.maxPricePerHour),
            };
        }

        if (req.query.hasDiscount) {
            filter.discount = { $gt: 0 };
        }

        if (req.query.carYear) {
            filter.year = parseInt(req.query.carYear);
        }

        const userId = req.body.user;

        if (userId) {
            // Fetch the user with populated favorites
            const user = await User.findById(userId).populate("favorites");

            // Check if user exists
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // If favorites query parameter is set to true, filter only favorite cars
            if (req.query.favorites === "true") {
                filter._id = { $in: user.favorites.map((favorite) => favorite._id) };
            }

            let cars = await Car.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(); // Use lean() to get plain JS objects instead of Mongoose documents.

            // Convert prices to the target currency if provided in the request
            const targetCurrency = req.query.currency || "SAR"; // Default currency is SAR (Saudi Riyal)

            if (targetCurrency !== "SAR") {
                // Fetch the base currency conversion rate from the API
                const baseCurrency = "SAR"; // Base currency is always SAR
                const convertedPrices = [];

                // Convert each car's price to the target currency
                for (const car of cars) {
                    const convertedPrice = await convertCurrency(
                        car.pricePerDay,
                        baseCurrency,
                        targetCurrency
                    );

                    convertedPrices.push(convertedPrice);
                }

                // Update each car's price with the converted value
                for (let i = 0; i < cars.length; i++) {
                    cars[i].pricePerDay = convertedPrices[i];
                }
            }

            // Add isFavorited field to each car
            cars.forEach((car) => {
                car.isFavorited = user.favorites.some(
                    (favorite) => favorite._id.toString() === car._id.toString()
                );
            });

            const total = await Car.countDocuments(filter); // Total count of filtered cars

            // Return cars along with pagination info
            res.json({ total, page, limit, cars, currency: targetCurrency });
        } else {
            let cars = await Car.find(filter)
                .skip((page - 1) * limit)
                .limit(limit);

            const targetCurrency = req.query.currency || "SAR"; // Default currency is SAR (Saudi Riyal)

            if (targetCurrency !== "SAR") {
                // Fetch the base currency conversion rate from the API
                const baseCurrency = "SAR"; // Base currency is always SAR
                const convertedPrices = [];

                // Convert each car's price to the target currency
                for (const car of cars) {
                    const convertedPrice = await convertCurrency(
                        car.pricePerDay,
                        baseCurrency,
                        targetCurrency
                    );

                    convertedPrices.push(convertedPrice);
                }

                // Update each car's price with the converted value
                for (let i = 0; i < cars.length; i++) {
                    cars[i].pricePerDay = convertedPrices[i];
                }
            }

            const total = await Car.countDocuments(filter); // Total count of filtered cars

            // Return cars along with pagination info
            res.json({ total, page, limit, cars, currency: targetCurrency });
        }
    } catch (error) {
        console.log(error); // log the error to your server console.
        res.status(500).json({ error: error.message }); // Send the actual error message as the response.
    }
};


// Admin controller

// Create a car
const createCar = async (req, res) => {
    try {
        // Upload new car image
        const newCarData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            type: req.body.type,
            brand: req.body.brand,
            engine: req.body.engine,
            airCondition: req.body.airCondition,
            bags: req.body.bags,
            seats: req.body.seats,
            doors: req.body.doors,
            pricePerDay: req.body.pricePerDay,
            pricePerHour: req.body.pricePerHour,
            pricePerMonth: req.body.pricePerMonth,
            availability: req.body.availability || true,
            discount: req.body.discount || 0,
            year: req.body.year,
            model: req.body.model,
            branch: req.body.branch,
        };


        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "cars",
            width: 300,
            crop: "scale",
        });
        newCarData.image = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        const car = await Car.create(newCarData);
        res.status(201).json(car);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

// Get a specific car by ID
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve the car" });
    }
};

const updateCar = async (req, res) => {
    try {
        const updatedCarData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            type: req.body.type,
            brand: req.body.brand,
            engine: req.body.engine,
            maxPeople: req.body.maxPeople,
            numDoors: req.body.numDoors,
            bags: req.body.bags,
            pricePerDay: req.body.pricePerDay,
            pricePerHour: req.body.pricePerHour,
            pricePerMonth: req.body.pricePerMonth,
            discount: req.body.discount,
            year: req.body.year,
        };

        const car = await Car.findById(req.params.carId);

        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }



        if (req.body.image) {
            const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
                folder: "cars",
                width: 150,
                crop: "scale",
            });
            updatedCarData.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.carId,
            updatedCarData,
            { new: true }
        );

        res.json(updatedCar);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update the car" });
    }
};


// Delete a car
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.carId);
        if (car) {
            res.json({ status: "success", message: "Car deleted successfully" });
        } else {
            res.status(404).json({ status: "error", message: "Car not found" });
        }
    } catch (error) {
        res
            .status(500)
            .json({ status: "error", message: "Failed to delete the car" });
    }
};

// Get available cars
const getAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({ availability: true });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve available cars" });
    }
};

// Update car availability
const updateCarAvailability = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.carId,
            { availability: req.body.availability },
            { new: true }
        );
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update car availability" });
    }
};

// Get all reviews for a car
const getAllReview = async (req, res) => {
    const { carId } = req.params;

    // Find the car
    const car = await Car.findById(carId).populate("reviews").exec();
    if (!car) {
        return res.status(404).json({ message: "Car not found" });
    }

    res.json(car.reviews);
};
// Get all cars by admin

const getAllCarsAdmin = async (req, res) => {
    try {
        const filter = {};
        const limit = 10; // Set default limit to 10
        const page = parseInt(req.query.page) || 1;

        // Apply filters based on request query parameters
        if (req.query.carType) {
            filter.type = req.query.carType;
        }

        if (req.query.carBrand) {
            const brands = req.query.carBrand.split(",");
            filter.brand = { $in: brands };
        }

        if (req.query.maxPeople) {
            filter.maxPeople = parseInt(req.query.maxPeople);
        }

        if (req.query.numDoors) {
            filter.numDoors = parseInt(req.query.numDoors);
        }
        if (req.query.category) {
            const categories = req.query.category.split(",");
            filter.category = { $in: categories };
        }

        if (req.query.minPricePerDay && req.query.maxPricePerDay) {
            filter.pricePerDay = {
                $gte: parseInt(req.query.minPricePerDay),
                $lte: parseInt(req.query.maxPricePerDay),
            };
        }

        if (req.query.minPricePerHour && req.query.maxPricePerHour) {
            filter.pricePerHour = {
                $gte: parseInt(req.query.minPricePerHour),
                $lte: parseInt(req.query.maxPricePerHour),
            };
        }

        if (req.query.hasDiscount) {
            filter.discount = { $gt: 0 };
        }

        if (req.query.carYear) {
            filter.year = parseInt(req.query.carYear);
        }
        const cars = await Car.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Car.countDocuments(filter); // Total count of filtered cars

        // Return cars along with pagination info
        res.json({ total, page, limit, cars });
    } catch (error) {
        console.log(error); // log the error to your server console.
        res.status(500).json({ error: error.message }); // Send the actual error message as the response.
    }
};

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    getAvailableCars,
    getAllCarsAdmin,
    updateCarAvailability,

    createReview,
    getAllReview,
    filterInfo,
};
