const express = require('express');
const favoriteController = require('../controllers/favouriteController');

const router = express.Router();

router.post('/add', favoriteController.addFavorite);
router.post('/remove', favoriteController.removeFavorite);

module.exports = router;
