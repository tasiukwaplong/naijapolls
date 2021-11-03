const adminController = require('../controllers').admin;
const institutionController = require('../controllers').institution;
const voterController = require('../controllers').voter;
const contestantController = require('../controllers').contestant;
const electionController = require('../controllers').election;
const ussdController = require('../controllers').ussd;

module.exports = (app) => {

  app.get('/api/', (req, res) => res.status(200).send({
    errored: false,
    message: {}
  }));

  // ###################################################
  // #           Admin endpoints                       #
  // #         (Login and logout)                      #
  // ###################################################
  app.post('/admin/login/', adminController.login);
  app.post('/admin/logout/', adminController.logout);
  
  // ###################################################
  // #           Institution endpoints                 #
  // ###################################################
  app.post('/institution/register', institutionController.add);
  app.get('/institution/verify/:token?', institutionController.verifyEmail);
  app.post('/institution/login', institutionController.login);
  app.post('/institution/me', institutionController.me);  
  app.post('/institution/all', institutionController.getInstitutions);
  app.post('/institution/status/update', institutionController.updateInstitutionApproval);

  // ###################################################
  // #           voter endpoints                       #
  // ###################################################
  app.post('/voter/add', voterController.addVoter);
  app.post('/voter/all', voterController.getVoters);
  app.post('/voter/update', voterController.update);
  app.post('/voter/delete', voterController.remove);
  // ###################################################
  // #           contestant endpoints                  #
  // ###################################################
  app.post('/contestant/add', contestantController.addContestant);
  app.post('/contestant/all', contestantController.getContestants);
  
  app.get('/election/result', contestantController.getElectionResults);
  // ###################################################
  // #           election endpoints                     #
  // ###################################################
  app.post('/election/edit', electionController.manageElectionStatus); 
  // ###################################################
  // #           ussd endpoints                     #
  // ###################################################
  app.post('/ussd', ussdController.handleUSSD); 
};
