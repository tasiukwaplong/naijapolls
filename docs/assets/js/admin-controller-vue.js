function appendDataToDisplay() {
  // append data to dashboard
  var app = new Vue({
    el: "#app",
    data: {
      institutions: adminData.message,
      voters: [],
      selectedItem: {},
      errorMsg: '',
      successMsg: '',
      selected: 'verification',
      wallets: wallets
    },
    methods: {
      logout: function(){
        document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        window.location = 'admin-login.html'
      },
      addWallet: async function (e) {
        // insert a new item
        let inputData = {};

        let self = this;

        await sendPostHTTPRequest("wallet/add", inputData)
          .then(function (data) {
            alert(data.message);
            window.location = 'admin-dashboard.html'
          })
          .catch(function (err) {
            let errMsg = err.responseJSON.message || "Server error. Could not add";
            self.errorMsg = errMsg || "Try again";
            alert(errMsg)
            window.location = 'admin-dashboard.html'
          });

        window.scrollTo(0, 0);
        return false;
      },
      loadvoters: async function(){
        let self = this;

        await sendPostHTTPRequest("item/all", adminToken)
        .then(function (data) {
          if (data.message && data.message[0] && data.message[0].id) {
            self.voters = data.message;

            let urlStr = window.location.href;
            let itemID = urlStr.search('id=')
            if(itemID > 1) self.loadItem()

            showLoadingGif({show: false});
          }
        })
        .catch(function (err) {
          showLoadingGif({body: err.responseJSON.message});
          // $(".modal-body").html();
          return err.responseJSON.message;
        });

      },

      changeApprovalStatus: async function(approval, id){
        let self = this;
        
        let inputdata = {
          token: adminToken.token, approval, id
        }

        // showLoadingGif(5000, 1);
        await sendPostHTTPRequest("institution/status/update", inputdata)
        .then(function (data) {
          if (data.errored === false){
            alert('Institution approval status updated successfully..!!')
            location.reload()
          }
          
          showLoadingGif({title:'NOT UPDATED', body:'Institution approval status could not be updated. Try again'});  

        })
        .catch(function (err) {
          showLoadingGif({body: err.responseJSON.message, title: 'NOT UPDATED'});
        });

      }
    },
    mounted: async function () {
      // before component loads
      // showLoadingGif();
      // this.loadvoters()
    },
  });
}
