const express = require('express');
const favoriteController = require('../controllers/favouriteController');

const router = express.Router();

router.post('/add', favoriteController.addFavorite);
router.post('/remove', favoriteController.removeFavorite);
router.get('/:userId', favoriteController.getFavorites);

module.exports = router;
