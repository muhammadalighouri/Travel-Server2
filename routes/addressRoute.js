// routes/address.js
const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Create a new address
router.post('/', addressController.createAddress);

// Get all addresses
router.get('/user/:id', addressController.getAllAddresses);

// Get a specific address
router.get('/:id', addressController.getAddressById);

// Update an address
router.put('/:id', addressController.updateAddress);

// Delete an address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
