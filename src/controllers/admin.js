const passwordHash = require('password-hash');
const { Admin, sequelize } = require('../database/models');
const MSG = require('../helpers/messages');

module.exports = {
  async login(req, res) {
    // admin login
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Username or password missing`
      });
    }
    return Admin
      .findOne({ where: { username: req.body.username } })
      .then((result) => {
        if (result && result.password && passwordHash.verify(req.body.password, result.password)) {
          return res.status(200).send({
            errored: false,
            message: { token: result.token}
          });
        }
        // login not successful
        return res.status(200).send({
          errored: true,
          message: MSG.ERROR.WRONG_LOGIN
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.ERROR_LOGGING_IN
        });
      });
  },
  async logout(req, res) {
    // change token, destroy former one
    if (!req.cookies.admin_token) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    const newToken = `${new Date().getTime()}_${Math.random().toString(36).slice(2)}${Math.floor(Math.random() * 100)}_L`;
    return sequelize.query(`UPDATE Admins SET token = '${newToken}' WHERE token = '${req.cookies.admin_token}'`)
      .then((rslt) => {
        res.status(200).send({
          errored: (rslt[0].affectedRows < 1),
          message: {}
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.LOGOUT_FAILED
        });
      });
  }
};
