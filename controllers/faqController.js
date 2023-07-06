const FAQ = require('../models/faqModel');

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json(faq);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
};

// Update an existing FAQ
exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!faq) {
            return res.status(404).json({ error: 'FAQ not found' });
        }
        res.json(faq);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
};

// Delete an existing FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) {
            return res.status(404).json({ error: 'FAQ not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
};
