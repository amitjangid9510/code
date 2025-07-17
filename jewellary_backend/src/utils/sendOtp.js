const axios = require('axios');

const sendOtp = async (phone, otp) => {
  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      variables_values: otp,
      route: 'otp',
      numbers: phone
    }, {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Fast2SMS Error:', error.response?.data || error.message);
    throw new Error('Failed to send OTP');
  }
};

module.exports = sendOtp;
