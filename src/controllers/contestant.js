const { Contestant, Institution } = require("../database/models");
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
  async addContestant(req, res){
    // insert Contestant
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

    return Contestant.create({
      owner_id: ownerID,
      name: req.body.name,
      post: req.body.post,
      extra: req.body.extra || '',
      post_extra: `${req.body.post}-${req.body.extra}-${req.body.name}`
    })
      .then((e) => {
        //   console.log(e);
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.CONTESTANT_ADDED,
        });
      })
      .catch((e) => {
        // console.log(e);
        res.status(200).send({
          errored: true,
          message: e.errors[0].message || MSG.ERROR.CONTESTANT_NOT_ADDED,
        });
      });
  },
  async getContestants(req, res) {
    // get all Contestants
    if (!req.body.token) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    let owner_id = await userExists(req.body.token);

    if (owner_id === false) {
      return res.status(200).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    return Contestant
      .findAll({ where: {owner_id}, order: [['id', 'DESC']] })
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
  async update(req, res) {
    // Update Contestant
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

    return Contestant
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
        // console.log(error);
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_UPDATE_FAILED
        });
      });
  },
  async remove(req, res) {
    // Delete Contestant
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

    return Contestant
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
  async getElectionResults(req, res) {
    // get all Contestants
    return Contestant
      .findAll({ where: {ban: 0}, order: [['votes', 'DESC']] })
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
};
