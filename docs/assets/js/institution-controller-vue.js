function appendDataToDisplay() {
  // append data to dashboard
  var app = new Vue({
    el: "#app",
    data: {
      institution: institutionData.message,
      voters: [],
      contestants: [],
      payments: payments.message || {},
      selectedItem: {},
      selectedContestant: {},
      errorMsg: "",
      successMsg: "",
      selected: 'voters'
    },
    methods: {
      loadVoterspage: function (id) {
        window.location = "voters.html?id=" + id;
      },
      logout: function(){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        window.location = 'login.html'
      },
      loadItemFromList: function () {
        let urlStr = window.location.href;
        let searchedStr = urlStr.search("id=");
        let itemIndex = urlStr.substring(searchedStr + 3);

        this.selectedItem = this.voters[itemIndex] || {}; // assign value to it
      },
      stopVoting: function () {
        this.manageElectionStatus('stop')
      },
      manageElectionStatus: async function (e) {
        let inputData = {
          voting_status: false,
          voting_description: '',
          token: institutionToken.token
        };

        if(e !== 'stop' && this.institution.voting_status === false){
          // election is not ongoing and should be started
          e.preventDefault();
          inputData = {
            voting_status: true,
            voting_description: this.institution.description,
            token: institutionToken.token
          };
        }

        showLoadingGif();
        let self = this;

        await sendPostHTTPRequest(`election/edit`, inputData)
          .then(function (data) {
            if (data.message && data.errored === false) {
              self.successMsg = data.message;
              self.selectedItem = {};
              window.alert(data.message)
              location.reload()
            } else {
              self.errorMsg = data.message || "Server error";
              window.alert(data.message)
              location.reload()
            }
          })
          .catch(function (err) {
            let errMsg = err.responseJSON.message || "Server error. Could not add";
            self.errorMsg = errMsg || "Could not start. Try again";
            window.alert(self.errorMsg)
            location.reload()
          });

        showLoadingGif({ show: false });
        this.loadVoters();
        window.scrollTo(0, 0);
        
        return false;
      },
      manageUser: function (e) {
        e.preventDefault();


        if (!this.selectedItem.id && this.selectedItem.phone) this.addNewUser();
        else if (this.selectedContestant.name) this.addNewUser(type = 'contestant');
        else this.editVoter();

        return false;
      },
      addNewUser: async function (type = 'voter') {
        // insert new voter
        let inputData = {
          token: institutionToken.token,
          phone: this.selectedItem.phone
        };

        if(type === 'contestant'){
          inputData = {
              post: this.selectedContestant.post,
              name: this.selectedContestant.name,
              token: institutionToken.token,
              extra: this.selectedContestant.extra,
          };
        }

        showLoadingGif();
        let self = this;

        await sendPostHTTPRequest(`${type}/add`, inputData)
          .then(function (data) {
            if (data.message && data.errored === false) {
              self.successMsg = data.message;
              self.selectedItem = {};
              setTimeout(function() {
                location.reload()
              }, 3000);

            } else {
              self.errorMsg = data.message || "Server error";
            }
          })
          .catch(function (err) {
            let errMsg = err.responseJSON.message || "Server error. Could not add";
            self.errorMsg = errMsg || "Try again";
            // return errMsg;
          });

        showLoadingGif({ show: false });
        this.loadVoters();
        window.scrollTo(0, 0);
        return false;
      },
      editVoter: async function () {
        // edit an existing voter
        let inputData = {
          id: this.selectedItem.id,
          token: institutionToken.token,
          phone: this.selectedItem.phone
        };

        showLoadingGif();
        let self = this;

        await sendPostHTTPRequest("/voter/update", inputData)
          .then(function (data) {
            // console.log(inputData);
            if (data.message && data.errored === false) {
              self.successMsg = data.message;
              self.selectedItem = {};
            } else {
              self.errorMsg = data.message || "Server error";
            }
          })
          .catch(function (err) {
            let errMsg = (err.responseJSON && err.responseJSON.message) ? err.responseJSON.message : "Server error. Could not edit item";
            self.errorMsg = errMsg || "Try again";
          });

        showLoadingGif({ show: false });
        this.loadVoters();
        window.scrollTo(0, 0);
        return false;
      },
      deleteVoter: async function (){
        // delete voter
        let inputData = {
          id: this.selectedItem.id,
          token: institutionToken.token
        };

        showLoadingGif();
        let self = this;

        await sendPostHTTPRequest("/voter/delete", inputData)
          .then(function (data) {
            // console.log(inputData);
            if (data.message && data.errored === false) {
              self.successMsg = data.message;
              self.selectedItem = {};
              window.location = 'voters.html'
            } else {
              self.errorMsg = data.message || "Server error";
            }
          })
          .catch(function (err) {
            let errMsg = (err.responseJSON && err.responseJSON.message) ? err.responseJSON.message : "Server error. Could not edit item";
            self.errorMsg = errMsg || "Try again";
          });

        showLoadingGif({ show: false });
        this.loadVoters();
        return false; 
      },
      loadVoters: async function () {
        let self = this;

        await sendPostHTTPRequest("voter/all", institutionToken)
          .then(function (data) {
            if (data.message && data.message[0] && data.message[0].id) {
              self.voters = data.message;

              let urlStr = window.location.href;
              let voterID = urlStr.search("id=");
              if (voterID > 1) self.loadItemFromList();
            }
            showLoadingGif({ show: false });
          })
          .catch(function (err) {
            showLoadingGif({ title: "ERROR", body: err.responseJSON.message });
            // return err.responseJSON.message;
          });
      },
      loadContestants: async function () {
        let self = this;

        await sendPostHTTPRequest("contestant/all", institutionToken)
          .then(function (data) {
            if (data.message && data.message[0] && data.message[0].id) {
              self.contestants = data.message;

              let urlStr = window.location.href;
              let contestantID = urlStr.search("id=");
              if (contestantID > 1) self.loadItemFromList();
            }
            showLoadingGif({ show: false });
          })
          .catch(function (err) {
            showLoadingGif({ title: "ERROR", body: err.responseJSON.message });
            // return err.responseJSON.message;
          });
      },
    },
    mounted: async function () {
      // before component loads
      // showLoadingGif();
      this.loadVoters();
      this.loadContestants();
    },
  });
}
