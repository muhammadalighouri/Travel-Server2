const express = require('express');
const faqController = require('../controllers/faqController');

const router = express.Router();

router.route('/')
    .get(faqController.getAllFAQs)
    .post(faqController.createFAQ);

router.route('/:id')
    .put(faqController.updateFAQ)
    .delete(faqController.deleteFAQ);

module.exports = router;
