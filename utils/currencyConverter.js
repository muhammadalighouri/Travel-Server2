const axios = require("axios");

const convertCurrency = async (amount, baseCurrency, targetCurrency) => {
    const apiKey = '9eaf47a5e95a4ca9b249e32de7a11f1a'; // Replace with your API key
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const exchangeRates = response.data.rates;

        // Convert the amount from the base currency to the target currency
        let convertedAmount = (amount / exchangeRates[baseCurrency]) * exchangeRates[targetCurrency];

        // Round the converted amount to one decimal place
        convertedAmount = Math.round(convertedAmount * 10) / 10;

        return convertedAmount;
    } catch (error) {
        console.log('Currency conversion failed:', error);
        return null; // Return a default value or handle the error appropriately
    }
};

module.exports = convertCurrency;
