const { Voter, Institution, sequelize } = require("../database/models");
const MSG = require("../helpers/messages");

const userExists = (token) => {
  //check if user already exists
  return Institution.findOne({ where: { token } })
    .then((result) => {
      return result.id || false;
    })
    .catch((err) => {
      return false;
    });
};

module.exports = {
  async addVoter(req, res){
    // insert Voter
    if (req.body.token === 'undefined') {
      // wrong input
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    let ownerID = await userExists(req.body.token);

    if (ownerID === false) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    return Voter.create({
      owned_by: ownerID,
      phone: req.body.phone,
      pin: Math.floor(Math.random() * 999999).toString().slice(-4)
    })
      .then(() => {
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.VOTER_ADDED,
        });
      })
      .catch((e) => {
        res.status(200).send({
          errored: true,
          message: e.errors[0].message || MSG.ERROR.VOTER_NOT_ADDED,
        });
      });
  },
  async getVoters(req, res) {
    // get all Voters
    if (!req.body.token) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    let owned_by = await userExists(req.body.token);

    if (owned_by === false) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    return Voter
      .findAll({ where: {owned_by}, order: [['id', 'DESC']] })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async getVoter(phone = '') {
    // get a voter info and voting info
    if (phone.length < 11) {
      return {errored: true, mesage: `${MSG.ERROR.INPUT_INVALID} for phone number`}
    }

    return sequelize
    .query(`SELECT voting_description, voting_status, phone, Voters.id, Voters.votes as voters_vote, Institutions.votes as institution_votes FROM Voters INNER JOIN Institutions ON Voters.owned_by = Institutions.id AND Voters.phone = '${phone}' AND Voters.ban = 0`)
    .then((result) => {
      return {
        errored: !(result && result[0] && result[0][0] && result[0][0].phone),
        message: !(result && result[0] && result[0][0] && result[0][0].phone) ? MSG.ERROR.RECORD_NOT_FOUND : result[0][0]
      };
    }).catch((e) => {
        return {
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        };
      });
  },
  async update(req, res) {
    // Update Voter
    if (!req.body.token || !req.body.id) {
      // wrong input
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    let owned_by = await userExists(req.body.token);

    if (owned_by === false) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    const {token, phone } = req.body;

    return Voter
      .update({token, phone }, {
        where: { id: req.body.id }
      })
      .then((rowsAffected) => {
        // console.log(rowsAffected, 'here');

        res.status(200).send({
          errored: (rowsAffected[0] !== 1),
          message: (rowsAffected[0] === 1)
            ? MSG.SUCCESS.RECORD_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_UPDATE_FAILED
        });
      });
  },
  async vote(data = {}) {
    // Update Voter votes
    const {votes, phone, id = '0' } = data;

    return Voter
      .update({votes}, {
        where: { phone }
      })
      .then((rowsAffected) => {
        sequelize.query(`UPDATE Contestants SET votes = votes + 1 WHERE id = ${id}`);
        return {
          errored: (rowsAffected[0] !== 1),
          message: (rowsAffected[0] === 1)
            ? MSG.SUCCESS.RECORD_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED
        };
      })
      .catch((error) => {
        // console.log(error);
        return {
          errored: true,
          message: MSG.ERROR.RECORD_UPDATE_FAILED
        };
      });
  },
  async remove(req, res) {
    // Delete Voter
    if (!req.body.token || !req.body.id) {
      // wrong input
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    let owned_by = await userExists(req.body.token);

    if (owned_by === false) {
      // console.log(owned_by);

      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    return Voter
    .destroy({ where: { id: req.body.id } })
    .then((deleteStatus) => {
      res.status(200).send({
        errored: (deleteStatus <= 0),
        message: (deleteStatus <= 0) ? MSG.ERROR.DELETE_UNSUCCESSFUL : MSG.SUCCESS.DELETE_SUCCESS
      });
    })
    .catch((error) => {
      res.status(200).send({
        errored: true,
        message: MSG.ERROR.DELETE_UNSUCCESSFUL
      });
    });
  },
};
