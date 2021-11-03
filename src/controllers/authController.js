const { Admin } = require('../database/models');
const emailer = require('./emailer');

module.exports = {
  async allowedToManageStore(cookie = false) {
    // check if user can perform requested action
    if (!cookie) return false;
    return Admin.findOne({where: { token: cookie }})
    .then((result) => { // eslint-disable-line
      return (result && result.dataValues) ? result.dataValues : 'NOT_FOUND';
    }).catch((err)=>{
      return false;
    });
  },
  async sendConfirmationEmail(email, token, institution){
    // send email containg confirmation email
    if(!email || !token) return false;
    const confirmationLink = `https://naija-polls.herokuapp.com/institution/verify/${token}`;//`http://localhost:8000/institution/verify/${token}`;
    const body = `Hello ${institution},
    Click on the link below to confirm this email belongs to you. If you did not request for this, kindly ignore the message.
    <a href='${confirmationLink}'>${confirmationLink}</a>
    `;
    return emailer.send(email, '[IMPORTANT] EMAIL CONFIRMATION', body);
  }
};
