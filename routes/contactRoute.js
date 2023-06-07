const express = require('express');
const bookingController = require('../controllers/bookingController');
const { sendMessage } = require('../utils/sendEmail');

const router = express.Router();

router.post("/", (req, res) => {
    const { name, phone, email, message } = req.body;

    sendMessage(name, phone, email, message)
        .then(() => {
            res.status(200).json({ message: "Email sent successfully!" });
        })
        .catch((error) => {
            res.status(500).json({ error: "Failed to send email." });
        });
});

module.exports = router;
