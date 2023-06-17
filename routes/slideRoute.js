const express = require('express');
const router = express.Router();
const { createSlide, getSlides, deleteSlide, updateSlide } = require('../controllers/slideController');


router.post('/', createSlide);
router.get('/', getSlides);
router.delete('/:id', deleteSlide);
router.patch('/:id', updateSlide);

module.exports = router;
