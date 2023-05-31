const User = require('../models/userModel');
const Car = require('../models/carModel');

// Add a car to favorites
const addFavorite = async (req, res) => {
    const { userId, carId } = req.body;

    try {
        const user = await User.findById(userId);
        const car = await Car.findById(carId);

        if (!user || !car) {
            return res.status(404).json({ message: 'User or car not found' });
        }

        user.favorites.push(car);
        car.favoritedBy.push(user);

        await user.save();
        await car.save();

        return res.status(200).json({ message: 'Car added to favorites' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Remove a car from favorites
const removeFavorite = async (req, res) => {
    const { userId, carId } = req.body;

    try {
        const user = await User.findById(userId);
        const car = await Car.findById(carId);

        if (!user || !car) {
            return res.status(404).json({ message: 'User or car not found' });
        }

        user.favorites.pull(car);
        car.favoritedBy.pull(user);

        await user.save();
        await car.save();

        return res.status(200).json({ message: 'Car removed from favorites' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
};
