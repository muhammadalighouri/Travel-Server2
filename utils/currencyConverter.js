const axios = require("axios")

const convertCurrency = async (amount, baseCurrency, targetCurrency) => {
    const apiKey = 'b3922bbd5b844e49907007e308edab9a'; // Replace with your API key
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const exchangeRates = response.data.rates;

        // Convert the amount from the base currency to the target currency
        const convertedAmount = (amount / exchangeRates[baseCurrency]) * exchangeRates[targetCurrency];

        return convertedAmount;
    } catch (error) {
        console.log('Currency conversion failed:', error);
        return null; // Return a default value or handle the error appropriately
    }
};

module.exports = convertCurrency;
