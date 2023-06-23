// controllers/addressController.js
const Address = require("../models/adressModel");
const User = require("../models/userModel");

exports.createAddress = async (req, res) => {
    try {
        const { street, city, state, zip, user, title, latLong } = req.body;

        // Check if the user exists
        const userExist = await User.findById(user);
        if (!userExist) {
            return res.status(400).json({
                error: "User not found",
            });
        }

        const existingAddress = await Address.findOne({ title: title });
        if (existingAddress) {
            return res.status(400).json({
                error: "Title already used",
            });
        }

        const address = new Address({ street, city, state, zip, user: userExist._id, title });
        const savedAddress = await address.save();

        // Add the address to the user's address array
        userExist.addresses.push(savedAddress._id);
        await userExist.save();

        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all addresses by user
exports.getAllAddresses = async (req, res) => {
    try {

        const addresses = await Address.find({ user: req.params.id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const { street, city, state, zip, title } = req.body;
        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { title, street, city, state, zip },
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }
        res.json(updatedAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        // Remove the address from the user's address array
        const user = await User.findById(deletedAddress.user);
        if (user) {
            user.addresses.pull(deletedAddress._id);
            await user.save();
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
