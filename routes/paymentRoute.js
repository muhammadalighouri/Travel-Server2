const express = require('express');
const axios = require('axios');

const app = express();


const ACCESS_TOKEN = 'OGFjN2E0Yzg4NDA5MDk1MzAxODQwOWE3ZTI3MjAxOTh8bWRCUjZHVGFzYQ==';
const ENTITY_ID = '8ac7a4c884090953018409a8b0ae019c'; // Replace with your Entity ID
const PAYMENT_TYPE = 'DB'; // Change this if needed
const CURRENCY = 'SAR'; // Change this if needed
const TEST_SERVER_URL = 'https://eu-test.oppwa.com/';

// Handle the payment request
app.post('/pay', async (req, res) => {
    try {
        const {
            amount,
            merchantTransactionId,
            customerEmail,
            billingStreet,
            billingCity,
            billingState,
            billingCountry,
            billingPostcode,
            customerGivenName,
            customerSurname
        } = req.body;

        // Prepare the request payload
        const payload = {
            entity_id: ENTITY_ID,
            amount: amount,
            currency: CURRENCY,
            paymentType: PAYMENT_TYPE,
            testMode: 'EXTERNAL',
            merchantTransactionId: merchantTransactionId,
            customer: {
                email: customerEmail,
                givenName: customerGivenName,
                surname: customerSurname
            },
            billing: {
                street1: billingStreet,
                city: billingCity,
                state: billingState,
                country: billingCountry,
                postcode: billingPostcode
            }
        };

        // Send the payment request to Hyperpay
        const response = await axios.post(`${TEST_SERVER_URL}/v1/checkouts`, payload, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });

        // Redirect the user to the payment page
        res.redirect(response.data.redirect.url);
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
});
// Endpoint to initiate a payment
app.post('/paymentss', async (req, res) => {
    try {
        // Generate a unique transaction ID for your database
        const merchantTransactionId = 'your_unique_id';

        // Set the required parameters for the payment request
        const data = {
            entity_id: '8ac7a4c884090953018409a8b0ae019c', // VISA/MASTER entity ID
            amount: '100.00', // Amount in SAR
            currency: 'SAR',
            paymentType: 'DB',
            testMode: 'EXTERNAL',
            merchantTransactionId,
            customer: {
                email: 'customer@example.com',
                givenName: 'John',
                surname: 'Doe',
            },
            billing: {
                street1: '123 Street',
                city: 'City',
                state: 'State',
                country: 'SA', // Alpha-2 country code (ISO 3166-1)
                postcode: '12345',
            },
        };

        // Make a POST request to Hyperpay API
        const response = await axios.post('https://eu-test.oppwa.com/', data, {
            headers: {
                Authorization: 'OGFjN2E0Yzg4NDA5MDk1MzAxODQwOWE3ZTI3MjAxOTh8bWRCUjZHVGFzYQ==', // Access Token
            },
        });

        // Handle the response from Hyperpay
        console.log(response.data);

        // Redirect the user to the payment page
        res.redirect(response.data.redirect.url);
    } catch (error) {
        console.error(error);
        res.status(500).send('Payment failed');
    }
});
module.exports = app