let institutionToken = { token: getCookie("token") };
let institutionData = {};
let voters = [];
let payments = [];
// let displayshowLoadingGif = false

getData();

async function getData() {
  
  showLoadingGif({priority: 0});
  let getFeedback = await sendPostHTTPRequest("institution/me", institutionToken)
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      showLoadingGif({body: err.responseJSON.message});
    });

    // let getFeedback2 = await sendPostHTTPRequest("payments/all", institutionToken)
    // .then(function (data) {
    //   return data;
    // })
    // .catch(function (err) {
    //   return {};
    // });

    institutionData = getFeedback;
    // payments = (getFeedback2.errored) ? [] : getFeedback2;
    // console.log(payments);
    if(institutionData.errored === true) showLoadingGif({priority: 0, body: institutionData.message})

  // if data is set
  if (institutionData.errored === false) {
    showLoadingGif({show: false});
    appendDataToDisplay();
  }
}

function showLoadingGif(options = {}) {
  let {waitTime = 3500, priority = 1, show = true, body = "Processing....", title = 'ERROR'} = options;

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

  }, waitTime || 5000);
}
