// msegatService.js

const axios = require('axios');

const BASE_URL = 'https://www.msegat.com/gw/';
const USER_NAME = 'travelcrs'; // Your Msegat username
const API_KEY = '9246851e9f883d99fb7478829c43f76d'; // Your Msegat API key
const USER_SENDER = 'auth-mseg';

const sendOtp = async (phoneNumber, lang = 'En') => {
    try {
        const response = await axios.post(`${BASE_URL}sendOTPCode.php`, {
            lang,
            userName: USER_NAME,
            apiKey: API_KEY,
            number: phoneNumber,
            userSender: USER_SENDER,
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const verifyOtp = async (code, id, lang = 'En') => {
    try {
        const response = await axios.post(`${BASE_URL}verifyOTPCode.php`, {
            lang,
            userName: USER_NAME,
            apiKey: API_KEY,
            code,
            id,
            userSender: USER_SENDER,
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
};
