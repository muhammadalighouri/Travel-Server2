const express = require('express');
const router = express.Router();
const { createSlide, getSlides, deleteSlide, updateSlide, createSponsor, getSponsor, deleteSponsor, updateSponsor } = require('../controllers/sponsorController');


router.post('/', createSponsor);
router.get('/', getSponsor);
router.delete('/:id', deleteSponsor);
router.patch('/:id', updateSponsor);

module.exports = router;
