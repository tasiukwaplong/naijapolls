let adminToken = { token: getCookie("adminToken") };
let adminData = {};
let items = [];
let wallets = []

getAdminData();

async function getAdminData() {
  
  showLoadingGif({priority: 0});
  let getFeedback = await sendPostHTTPRequest("institution/all", adminToken)
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      showLoadingGif({body: err.responseJSON.message, priority: 0});
      return err.responseJSON.message;
    });

  adminData = getFeedback;

//   let getFeedback2 = await sendPostHTTPRequest("wallet/all", adminToken)
//   .then(function (data) {
//     return data;
//   })
//   .catch(function (err) {
//     showLoadingGif({body: err.responseJSON.message, priority: 0});
//     return err.responseJSON.message;
//   });

// wallets = (getFeedback2.errored === false) ? getFeedback2.message : [];
// console.log(wallets);

  
  if(adminData.errored !== 'undefined' && adminData.errored === true) showLoadingGif({priority: 0, body: adminData.message})

  // if data is set
  if (adminData.errored !== 'undefined' && adminData.errored === false) {
    showLoadingGif({show: false});
    appendDataToDisplay();
  }
}

function showLoadingGif(options = {}) {
  let {waitTime = 5000, priority = 1, show = true, body = "Processing......", title = 'ERROR', reload = false} = options;
  
  if (options.body) clearTimeout();

  if (priority === 0) $(".wrapper").hide();
  
  $(".dismiss1").hide();
  $(".dismiss2").hide();

  $("#myModal").modal({
    backdrop: "static",
    keyboard: false,
  });

  if (show === false) {
    $(".wrapper").show();
    $(".modal").modal("hide");
    clearTimeout();
    return;
  }

  // if(reload) waitAndReload();

  setTimeout(function () {
    $(".modal-body").html(body);
    $(".modal-title").html(title);
    
    if (priority > 0) {
      // display body and close btn
      $(".wrapper").show();
      $(".dismiss1").show();
    } else {
      $(".dismiss2").show();
    }


  }, waitTime);
}


// function waitAndReload(){
//   clearTimeout();

//   setTimeout(function () {
//     location.reload();
//   }, 2000);
// }