const cartModels = require("../models/carModel");

// Filter cars based on multiple criteria
const filterCars = async (req, res) => {
    try {
        const filter = {};
        const limit = 10;  // Set default limit to 10
        const page = parseInt(req.query.page) || 1;

        // Apply filters based on request query parameters
        if (req.query.carType) {
            filter.type = req.query.carType;
        }

        if (req.query.carBrand) {
            filter.brand = req.query.carBrand;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.maxPeople) {
            filter.maxPeople = parseInt(req.query.maxPeople);
        }

        if (req.query.numDoors) {
            filter.numDoors = parseInt(req.query.numDoors);
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

        const cars = await cartModels.Car.find(filter) // Use the filter here
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await cartModels.Car.countDocuments(filter);  // Total count of filtered cars
        console.log(cars);

        // Return cars along with pagination info
        res.json({ cars });
    } catch (error) {
        console.log(error);  // log the error to your server console.
        res.status(500).json({ error: error.message });  // Send the actual error message as the response.
    }
};
const filterInfo = async (req, res) => {
    try {
        // Categories with counts
        const categoryCounts = await cartModels.Car.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Brands with counts
        const brandCounts = await cartModels.Car.aggregate([
            { $group: { _id: "$brand", count: { $sum: 1 } } }
        ]);

        // Models (types) with counts
        const modelCounts = await cartModels.Car.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        // Price range
        const minPrice = await cartModels.Car.find().sort({ pricePerDay: 1 }).limit(1).select('pricePerDay');
        const maxPrice = await cartModels.Car.find().sort({ pricePerDay: -1 }).limit(1).select('pricePerDay');

        // Number of available cars
        const availableCarsCount = await cartModels.Car.countDocuments({ availability: true });

        // Number of unavailable cars
        const unavailableCarsCount = await cartModels.Car.countDocuments({ availability: false });

        res.json({
            categories: {
                name: "categories",
                data: categoryCounts
            },
            brands: {
                name: "brands",
                data: brandCounts
            },
            models: {
                name: "models",
                data: modelCounts
            },
            priceRange: {
                name: "priceRange",
                data: {
                    min: minPrice[0]?.pricePerDay || 0,
                    max: maxPrice[0]?.pricePerDay || 0,
                }
            },
            availabilityCount: {
                name: "availabilityCount",
                data: {
                    available: availableCarsCount,
                    unavailable: unavailableCarsCount
                }
            }
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
    const car = await cartModels.cartModels.Car.findById(carId);
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

// Get all reviews for a car
const getAllReview = async (req, res) => {
    const { carId } = req.params;

    // Find the car
    const car = await cartModels.Car.findById(carId).populate("reviews").exec();
    if (!car) {
        return res.status(404).json({ message: "Car not found" });
    }

    res.json(car.reviews);
};

// Create a car
const createCar = async (req, res) => {
    try {
        const car = await cartModels.Car.create(req.body);
        res.status(201).json(car);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const filter = {};
        const limit = 10;  // Set default limit to 10
        const page = parseInt(req.query.page) || 1;

        // Apply filters based on request query parameters
        if (req.query.carType) {
            filter.type = req.query.carType;
        }

        if (req.query.carBrand) {

            const brands = req.query.carBrand.split(',');
            filter.brand = { $in: brands };
        }

        if (req.query.maxPeople) {
            filter.maxPeople = parseInt(req.query.maxPeople);
        }

        if (req.query.numDoors) {
            filter.numDoors = parseInt(req.query.numDoors);
        }
        if (req.query.category) {
            const categories = req.query.category.split(',');
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

        const cars = await cartModels.Car.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await cartModels.Car.countDocuments(filter);  // Total count of filtered cars

        // Return cars along with pagination info
        res.json({ total, page, limit, cars });
    } catch (error) {
        console.log(error);  // log the error to your server console.
        res.status(500).json({ error: error.message });  // Send the actual error message as the response.
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

// Update a car
const updateCar = async (req, res) => {
    try {
        const car = await cartModels.Car.findByIdAndUpdate(
            req.params.carId,
            req.body,
            { new: true }
        );
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update the car" });
    }
};

// Delete a car
const deleteCar = async (req, res) => {
    try {
        const car = await cartModels.Car.findByIdAndDelete(req.params.carId);
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
        const cars = await cartModels.Car.find({ availability: true });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve available cars" });
    }
};

// Get cars by type
const getCarsByType = async (req, res) => {
    try {
        const cars = await Car.find({ type: req.params.carType });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cars by type" });
    }
};

// Get cars by brand
const getCarsByBrand = async (req, res) => {
    try {
        const cars = await Car.find({ brand: req.params.carBrand });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cars by brand" });
    }
};

// Get cars by maximum capacity
const getCarsByMaxCapacity = async (req, res) => {
    try {
        const cars = await Car.find({ maxPeople: req.params.maxPeople });
        res.json(cars);
    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to retrieve cars by maximum capacity" });
    }
};

// Get cars by number of doors
const getCarsByNumDoors = async (req, res) => {
    try {
        const cars = await Car.find({ numDoors: req.params.numDoors });
        res.json(cars);
    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to retrieve cars by number of doors" });
    }
};

// Get cars within a price range
const getCarsByPriceRange = async (req, res) => {
    try {
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);
        const cars = await Car.find({
            priceBefore: { $gte: minPrice, $lte: maxPrice },
        });
        res.json(cars);
    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to retrieve cars within the price range" });
    }
};

// Get cars with discounts
const getDiscountedCars = async (req, res) => {
    try {
        const cars = await Car.find({ discount: { $gt: 0 } });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve discounted cars" });
    }
};

// Get cars by year
const getCarsByYear = async (req, res) => {
    try {
        const cars = await Car.find({ year: req.params.carYear });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cars by year" });
    }
};

// Check car availability
const checkCarAvailability = async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (car) {
            res.json({ available: car.availability });
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to check car availability" });
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

// Apply discount to a car
const applyDiscountToCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.carId,
            { discount: req.body.discount },
            { new: true }
        );
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to apply discount to the car" });
    }
};

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    getAvailableCars,
    getCarsByType,
    getCarsByBrand,
    getCarsByMaxCapacity,
    getCarsByNumDoors,
    getCarsByPriceRange,
    getDiscountedCars,
    getCarsByYear,
    checkCarAvailability,
    updateCarAvailability,
    applyDiscountToCar,
    filterCars,
    createReview,
    getAllReview,
    filterInfo
};
