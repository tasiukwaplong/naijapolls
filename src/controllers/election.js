const { Institution, Contestant, Voter } = require("../database/models");
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

const getElectionDisplay = (record = []) => {
  let display = {};

  if(typeof record !== 'object' || record.length < 1) return display;
  record.forEach((contestant, indx) => {
    if(!display[contestant.post]) display[contestant.post] = [];
    display[contestant.post].push(`${contestant.id}. ${contestant.name} ${contestant.extra}`);
  });

  return display;
};

module.exports = {
    async manageElectionStatus(req, res) {
        // update status of election
        if (!req.body.token) {
          return res.status(200).send({
              errored: true,
              message: `${MSG.ERROR.INPUT_INVALID}. token required`,
            });
        }

        let owner_id = await userExists(req.body.token);

        if (owner_id === false) {
          return res.status(200).send({
            errored: true,
            message: MSG.ERROR.UNAUTHORISED_ACCESS
          });
        }

        return Contestant.findAll({ where: {owner_id}, order: [['post', 'DESC']] }).then((d) => {
          const votes = getElectionDisplay(d);
          if(Object.keys(votes).length < 1){
            return res.status(200).send({
              errored: true,
              message: MSG.ERROR.RECORD_UPDATE_FAILED
            });
          }

          let voterDisplay = {}
          Object.keys(votes).forEach((d) => {
            voterDisplay[d] = 0;
          })
          
          // update the election status
          return Institution.update({
            voting_description: req.body.voting_description, 
            voting_status: req.body.voting_status,
            votes: JSON.stringify(votes) },
            {
              where: { token: req.body.token },
            }
          )
            .then((rowsAffected) => {
              // update each user eligible to vote

              if(rowsAffected[0] === 1){
                return Voter.update(
                  {votes: JSON.stringify(voterDisplay)}, 
                  {where: {owned_by: owner_id, ban: 0}
                }).then((rslt) => {
                  // console.log(rslt);
                  res.status(200).send({
                    errored: rslt[0] !== 1,
                    message:
                      rslt[0] >= 1 ? MSG.SUCCESS.ELECTION_STATUS_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED,
                  });
                })
              }

              // failed
              return res.status(200).send({
                errored: true,
                message: MSG.ERROR.RECORD_UPDATE_FAILED
              });
              
            })

          // console.log(getElectionDisplay(d));
        }).catch((e) => {
          console.log(e, 'error');
        })

    
        return Institution.update(
          { voting_description: req.body.voting_description, voting_status: req.body.voting_status },
          {
            where: { token: req.body.token },
          }
        )
          .then((rowsAffected) => {
            // console.log(rowsAffected);
            res.status(200).send({
              errored: rowsAffected[0] !== 1,
              message:
                rowsAffected[0] === 1 ? MSG.SUCCESS.ELECTION_STATUS_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED,
            });
          })
          .catch((error) => {
            // console.log(error);
            res.status(200).send({
              errored: true,
              message: error.errors[0].message || MSG.ERROR.RECORD_UPDATE_FAILED
            });
          });
    }

};