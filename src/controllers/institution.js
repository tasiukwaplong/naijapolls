const passwordHash = require("password-hash");
const { Institution, Admin, sequelize } = require("../database/models");
const MSG = require("../helpers/messages");
const auth = require("./authController");

const userExists = (email) => {
  //check if institution already exists
  return Institution.findOne({ where: { email } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return false;
    });
};

const isAdmin = (token) => {
  //check if it is admin
  return Admin.findOne({ where: { token } })
    .then((result) => {
      return result.token && result.token === token;
    })
    .catch((err) => {
      return false;
    });
};

module.exports = {
  async add(req, res) {
    // insert Institution
    if (!req.body.temp_email) {
      // wrong input
      return res.status(200).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID} for email`,
      });
    }

    if (await userExists(req.body.temp_email)) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.EMAIL_EXISTS,
      });
    }

    return Institution.create({
      temp_email: req.body.temp_email,
      password: req.body.password,
      type: req.body.type,
      name: req.body.name,
      slots: req.body.slots,
      short_description: req.body.short_description,
      address: req.body.address,
      contact_phone: req.body.contact_phone,
      token: `new_user_${new Date().getTime()}_${Math.random().toString(36).slice(2)}${Math.floor(
        Math.random() * 10000
      )}`,
    })
      .then(() => {
        // console.log(re)
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.INSTITUTION_ADDED,
        });
      })
      .catch((e) => {
        console.log(e);
        res.status(200).send({
          errored: true,
          message: MSG.ERROR.INSTITUTION_NOT_ADDED,
        });
      });
  },
  async verifyEmail(req, res) {
    // email verification
    const { token } = req.params;
    if (!token) {
      return res.status(200).send(MSG.EMAIL_VERIFICATION.ERROR);
    }

    const newToken = `${new Date().getTime()}_${Math.random().toString(36).slice(2)}`;
    const query = `UPDATE Institutions SET email = temp_email, temp_email = NULL, token = '${newToken}' WHERE token = '${token}'`;

    return sequelize
      .query(query)
      .then((rslt) => {
        const updated = rslt[0].affectedRows === 1;

        // search for the email address
        if (updated) {
          Institution.findOne({ where: { token: newToken } }).then((result) => {
            const { email } = result.dataValues || "";

            // delete any temp_email after successful update
            Institution.destroy({ where: { temp_email: email } }).then(() => {});
          });
        }

        if (updated) {
          res.status(200).send(MSG.EMAIL_VERIFICATION.SUCCESS);
        } else {
          res.status(200).send(MSG.EMAIL_VERIFICATION.ERROR);
        }
      })
      .catch(() => {
        res.status(200).send(MSG.EMAIL_VERIFICATION.ERROR);
      });
  },
  async login(req, res) {
    //log Institution Institution manager in
    if (!req.body.email || !req.body.password) {
      return res.status(200).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Email or password missing`,
      });
    }

    return Institution.findOne({ where: { email: req.body.email } })
      .then((result) => {
        // console.log((req.body.password, result.password));
        if (result && result.password && passwordHash.verify(req.body.password, result.password)) {
          return res.status(200).send({
            errored: false,
            message: { token: result.token },
          });
        }
        // login not successful
        return res.status(200).send({
          errored: true,
          message: MSG.ERROR.WRONG_LOGIN,
        });
      })
      .catch(() => {
        res.status(200).send({
          errored: true,
          message: MSG.ERROR.ERROR_LOGGING_IN,
        });
      });
  },
  async me(req, res) {
    //Institution fetching information about self
    if (!req.body.token) {
      return res.status(200).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Request must come with institution token`,
      });
    }

    return Institution.findOne({ where: { token: req.body.token } })
      .then((result) => {
        if (result && result.id) {
          return res.status(200).send({
            errored: false,
            message: result,
          });
        }
        // fetch not successful
        return res.status(200).send({
          errored: true,
          message: MSG.ERROR.UNAUTHORISED_ACCESS,
        });
      })
      .catch(() => {
        res.status(200).send({
          errored: true,
          message: MSG.ERROR.UNAUTHORISED_ACCESS,
        });
      });
  },
  async getInstitutions(req, res) {
    // fetch multiple Institutions
    if ((await isAdmin(req.body.token)) !== true) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    return Institution.findAll({ order: [["id", "DESC"]] })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result,
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND,
        });
      });
  },
  async updateInstitutionApproval(req, res) {
    // update status of Institution approval
    if (!req.body.token || !req.body.approval || !req.body.id) {
      return res
        .status(200)
        .send({
          errored: true,
          message: `${MSG.ERROR.INPUT_INVALID} for approval status or institution ID`,
        });
    }

    if ((await isAdmin(req.body.token)) !== true) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    return Institution.update(
      { approved: req.body.approval },
      {
        where: { id: req.body.id },
      }
    )
      .then((rowsAffected) => {
        // console.log(rowsAffected);
        res.status(200).send({
          errored: rowsAffected[0] !== 1,
          message:
            rowsAffected[0] === 1 ? MSG.SUCCESS.RECORD_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED,
        });
      })
      .catch((error) => {
        // console.log(error);
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.RECORD_UPDATE_FAILED,
        });
      });
  }
};
