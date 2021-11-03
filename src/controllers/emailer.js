const env = require('dotenv').config();
const axios = require('axios');

module.exports = {
  send(email, subject, body) {
    // send email automatically
    if(!email || !subject || !body) return '';

    return axios.post(process.env.GSUITE_URL, {
        sk: process.env.GSUITE_SECRET_KEY,
        email, subject, body
    })
      .then((response) => {
        // console.log(response)
        return response;
      })
      .catch((error) => {
        // console.log('message not sent', error);
        return error;
      });
  }
}