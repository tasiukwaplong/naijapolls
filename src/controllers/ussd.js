const MSG = require("../helpers/messages");
const voter = require("./voter");

function showSecondMenu(votes, text){
  // user selected to see list of candidates
  const cuttedText = text.split('#')
  const positionIndx = (text.length === 1) ? text : cuttedText[cuttedText.length - 1].slice(1)
  const allCandidates = JSON.parse(votes.institution_votes);

  const selectedPosition = getVotingPositions(votes.voters_vote, positionIndx)
  if(selectedPosition === false || typeof allCandidates !== 'object' || allCandidates.length < 1) return MSG.USSD_RESPONSE.CANNOT_PROCESS
  return `CON ${votes.voting_description} \n Choose preferred candidate for: ${selectedPosition} \n\n ${allCandidates[selectedPosition].join('\n')}`
}

async function showThirdMenu(votes, text){
  // user selected a candidadate he wished to vote for
  const cuttedText = text.split('*')
  const selectedContestantIndx = (text.length === 1) ? text : cuttedText[cuttedText.length - 1]
  const allCandidates = JSON.parse(votes.institution_votes);
  let voteData = {};
  Object.keys(allCandidates).forEach((cndt) => {
    allCandidates[cndt].forEach((post) => {
      if(selectedContestantIndx === post.slice(0,selectedContestantIndx.length)){
        // found post
        voteData = {post: cndt}
      }
    })
  })

  let parsedVotes = JSON.parse(votes.voters_vote);
  if(voteData.post && parsedVotes[voteData.post] === 0){
    parsedVotes[voteData.post] = selectedContestantIndx;
    const addVoteStatus = await voter.vote({phone: votes.phone, votes: JSON.stringify(parsedVotes), id: selectedContestantIndx});
    // console.log(addVoteStatus);
    if (addVoteStatus.errored === false) return MSG.USSD_RESPONSE.VOTE_SUCCESS
  }
  return MSG.USSD_RESPONSE.VOTING_FAILED;
}

const getVotingPositions = (serializedData, indexToReturn = '') => {
  const positions = JSON.parse(serializedData);
  if(typeof positions !== 'object') return MSG.USSD_RESPONSE.CANNOT_PROCESS
  let positionsToDisplay = '';

  if(indexToReturn.length > 0 && Object.keys(positions)[indexToReturn] !== undefined) return Object.keys(positions)[indexToReturn]
  if(indexToReturn.length > 0 && Object.keys(positions)[indexToReturn] === undefined) return false;

  Object.keys(positions).forEach((pst, indx) => {
    if(positions[pst] === 0) {
      positionsToDisplay += `\n ${indx} - ${pst}`;
    }
  });

  return (positionsToDisplay.length < 1) ? false : positionsToDisplay;
};

const isSecondMenu = (text) => {
  // is it a wallet menu command?
  const cuttedTextWithHash = text.split("#");
  let cuttedText = text.split("*");

  if(cuttedTextWithHash[cuttedTextWithHash.length - 1].indexOf("*") !== -1){
    cuttedText = cuttedTextWithHash[cuttedTextWithHash.length - 1].split('*')
  }
  // console.log(cuttedText, cuttedText.length)
  return (
    (text.length === 1 || cuttedText.length === 2)
  );
};

const isThirdMenu = (text) => {
  //is it candidate id selection menu?
  const cuttedTextWithHash = text.split("#");
  let cuttedText = text.split("*");

  if(cuttedTextWithHash[cuttedTextWithHash.length - 1].indexOf("*") !== -1){
    cuttedText = cuttedTextWithHash[cuttedTextWithHash.length - 1].split('*')
  }
  // console.log(cuttedText, cuttedText[cuttedText.length - 2]);
  // console.log(cuttedText, cuttedText.length)

  return (
    (text.length === 3 || cuttedText.length === 3)
  );
};

const menuDisplay = async (text = "", phoneNumber) => {
  // determine what menu to show
  const checkString = text.split("*");
  phoneNumber = phoneNumber.split('+234');
  phoneNumber = '0'+phoneNumber[1];
  const user = await voter.getVoter(phoneNumber);

  if(user.errored === true || user.message.phone === undefined){
    return MSG.USSD_RESPONSE.NOT_ELIGIBLE
  }

  const eligibleVoter = user.message;
  if(eligibleVoter.voting_status === 0) return MSG.USSD_RESPONSE.VOTING_NOT_STARTED
  const eligbleVotePositions = getVotingPositions(eligibleVoter.voters_vote);
  
  if(eligbleVotePositions === false){
    // voter has finished casting votes
    return MSG.USSD_RESPONSE.FINISHED_VOTING;
  }

  if (checkString[checkString.length - 1] === "#" || text === "#" || text === "") {
    return `CON ${eligibleVoter.voting_description}${eligbleVotePositions}`;
  }else if(isSecondMenu(text) && (text.length !== 3)){
    return showSecondMenu(eligibleVoter, text)
  }else if(isThirdMenu(text)){
    return showThirdMenu(eligibleVoter, text)
  }else{
    MSG.USSD_RESPONSE.CANNOT_PROCESS
  }
};

module.exports = {
  async handleUSSD(req, res) {
    // handle all USSD rquests
    const { sessionId = '', serviceCode='', phoneNumber='+2349020834649', text='0*9'} = req.body;
    // const {
    //   sessionId = "",
    //   serviceCode = "",
    //   phoneNumber = "+2349031514346",
    //   text = "",
    // } = req.body;
console.log(text);
    let ussdResponse = await menuDisplay(text.trim(), phoneNumber);

    res.set("Content-Type: text/plain");
    return res.send(ussdResponse);
  },
};