module.exports = {
  SUCCESS: {
    INSTITUTION_ADDED: 'Institution has been registered. A confirmation message has been sent to your email',
    VERIFCATION_SUCCESS: 'Email successfully verified. Kindly proceed to login to continue',
    VOTER_ADDED: 'Voter added successfully',
    RECORD_UPDATED: 'Voter phone number updated',
    DELETE_SUCCESS: 'Delete operation successful',
    CONTESTANT_ADDED: 'Added electorate successfully',
    ELECTION_STATUS_UPDATED: 'Election status updated successfully'
  },
  ERROR: {
    LESS_CHARACTERS: 'Input has less characters',
    EMPTY_USERNAME: 'Username cannot be empty',
    INVALID_PASSWORD_LENGTH: 'Password length should be entered as specified.',
    INVALID_PASSWORD: 'Password is not valid. Kindly provide a valid password',
    EMAIL_EMPTY: 'Email address cannot be empty',
    EMAIL_EXISTS: 'Email already exist. Click on the login link to continue',
    INSTITUTION_NOT_ADDED: 'Sorry, Institution could not added. Try again',
    WRONG_LINK: 'Oppps..!! Seems you clicked on a wrong or expired link.',  
    UNAUTHORISED_ACCESS: 'Sorry, you do not have access to the requested content. Kindly contact the system admin for more info',
    VOTER_NOT_ADDED: 'Could not add Voter. Try again',
    INVALID_PHONE: 'Phone number is not in the correct format',
    CUSTOMER_NOT_CREATED: 'Sorry, Wallet cannot be created. Please try again later',
    WALLET_UPDATE_FAILED: 'END Sorry, we could not process your request',
    INSUFFICIENT_BALANCE: 'END Your wallet is not funded for that transaction',
    INVALID_VOTER_ID: 'Invalid Voter ID entered. Try again',
    INAVILD_PIN: 'Invalid PIN eneterd',
    CONTESTANT_NOT_ADDED: 'Could not add electorate. Try again',

    BAD_REQUEST: 'Sorry, cannot process request. Input format does not match. Kindly check the documentation and try again',
    ERROR_REGISTERATION: 'An error occured trying to register you. Kindly try again',
    INPUT_INVALID: 'Input entered is not valid',
    NOT_A_NUMBER: 'Input must be a number',
    DELETE_UNSUCCESSFUL: 'Delete operation was NOT successful. Try again',
    INVALID_SEARCH: 'No result found',
    INVALID_OPTION_SELECTION: 'You have made an invalid option selection. It can only be either of a,b,c,d,e ',
    INVALID_CLASS_SELECTION: 'Class selected does not exist',
    RECORD_UPDATE_FAILED: 'Sorry, update not possible. Try again',
    RECORD_NOT_FOUND: 'Sorry, record not found. Try searching again',
    STAFF_CREATE_FAILED: 'Sorry, staff account could not be created. Try again',
    STUDENT_UPLOAD_FAIL: 'Student upload was NOT successful. Check the file and try again',
    ERROR_LOGGING_IN: 'Sorry, login was not possible. Try again',
    WRONG_LOGIN: 'Login not successful. Try again using correct details',
    LOGOUT_FAILED: 'Sorry, logout was not possible',
    QUESTION_INSERT_FAIL: 'Unable to insert question. Try again',
    SUBJECT_NOT_FOUND: 'Selected subject does not exist for selected class.',
    TIMER_UPDATE_FAILED: 'Timer update unsuccessful. Try again',
    ERROR_RETRIEVING_RESULT: 'There seem to be an error retrieving result of student. Kindly confirm if student is allowed to take this exams'
  },
  USSD_RESPONSE: {
    CANNOT_PROCESS: 'END Sorry, we cannot process your request. Try again',
    NOT_ELIGIBLE: 'END You are not eligible to participate in this election.',
    FINISHED_VOTING: 'END Congratulations..!! You are done voting. Results are being compiled and will be annouced in due time',
    VOTING_NOT_STARTED: 'END Sorry, elections have not started yet',
    VOTE_SUCCESS: 'CON Vote casted successfully. \n # - Continue voting',
    VOTING_FAILED: 'END Vote could not be casted. Incorrect format of input. Try again'
  },
  EMAIL_VERIFICATION: {
    ERROR: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>EMAIL VERIFICATION | NP</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <!-- jQuery library -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <!-- Popper JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
      <!-- Latest compiled JavaScript -->
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
    <body>
     <div class="modal fade" id="modelId" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">EMAIL VERIFICATION ERROR</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  
                </button>
            </div>
            <div class="modal-body text-center">
              <img src="../../../assets/images/err.gif" width="100%"/>
              <h4>Oppps..!! Seems you clicked on a wrong or expired link.</h4>
            </div>
            <div class="modal-footer">
              <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
              <a href="../../index.html" class="btn btn-primary">Go to homepage <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    </body>
    <script>
        $(".modal").modal({
          backdrop: "static",
          keyboard: false,
        });
    </script>
    </html>
    `,
    SUCCESS: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>EMAIL VERIFICATION | NP</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <!-- jQuery library -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <!-- Popper JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
      <!-- Latest compiled JavaScript -->
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
    <body>
     <div class="modal fade" id="modelId" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">EMAIL VERIFICATION SUCCESS</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  
                </button>
            </div>
            <div class="modal-body text-center">
              <img src="../../../assets/images/success.gif" width="100%" height="200px"/>
              <h5>Email successfully verified. Kindly proceed to login to continue</h5>
            </div>
            <div class="modal-footer">
              <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
              <a href="../../login.html" class="btn btn-primary">Login now <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    </body>
    <script>
        $(".modal").modal({
          backdrop: "static",
          keyboard: false,
        });
    </script>
    </html>
    `
  }
};
