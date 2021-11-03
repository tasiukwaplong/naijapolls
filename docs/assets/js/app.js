function registerInstitution() {
    // handle business registration
    let userInput = {
        "temp_email": document.getElementById('email').value,
        "password": document.getElementById('pwd').value,
        "type": document.getElementById('type').value,
        "name": document.getElementById('name').value,
        "slots": Number(document.getElementById('slots').value),
        "short_description": document.getElementById('short_description').value,
        "address": document.getElementById('address').value,
        "contact_phone": document.getElementById('phone').value
    };
    
    document.getElementById('submit').disabled = true
    document.getElementById('submit').innerHTML = 'Processing.....'

    $.post("institution/register", userInput)
        .done(function (data) {
            (data.errored)
                ? showModal(data.message || 'Error: could not register business')
                : showModal(data.message);
            document.getElementById("myForm").reset();
            document.getElementById('submit').disabled = false
            document.getElementById('submit').innerHTML = 'Submit'

        })
        .fail(function (data) {
            let failureMsg = (data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.message || "Unable to access server.";
            showModal(failureMsg)
            document.getElementById('submit').disabled = false
            document.getElementById('submit').innerHTML = 'Submit'

        });


    return false;
}

function login() {
    // handle business registration
    let userInput = {
        "email": document.getElementById('email').value,
        "password": document.getElementById('pwd').value
    };

    $.post("institution/login", userInput)
        .done(function (data) {
            if (data.errored === true || data.errored === undefined) {
                // if token is not returned
                showModal(data.message || 'Error: Something is wrong. Could not log you in.')
            } else {
                if (addCookie('token', data.message.token, 2)) {
                    // if it adds cookie successfully
                    window.location = 'dashboard.html';
                } else {
                    showModal('Unable to log in. Kindly enable cookie and javascript on your browser')
                }
            }
        })
        .fail(function (data) {
            let failureMsg = (data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.message || "Unable to access server.";
            showModal(failureMsg)
        });

    return false;
}


function adminLogin() {
    // handle business registration
    let userInput = {
        "username": document.getElementById('email').value,
        "password": document.getElementById('pwd').value
    };

    $.post("admin/login", userInput)
        .done(function (data) {
            if (data.errored === true || data.errored === undefined) {
                // if token is not returned
                showModal(data.message || 'Error: Something is wrong. Could not log you in.')
            } else {
                if (addCookie('adminToken', data.message.token, 2)) {
                    // if it adds cookie successfully
                    window.location = 'admin-dashboard.html';
                } else {
                    showModal('Unable to log in. Kindly enable cookie and javascript on your browser')
                }
            }
        })
        .fail(function (data) {
            let failureMsg = (data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.message || "Unable to access server.";
            showModal(failureMsg)
        });

    return false;
}

//util
function showModal(msg) {
    // show success or failure message
    $(".modal-body").html(msg);
    $("#myModal").modal('show');
}


function addCookie(cname, cvalue, exdays) {
    // add cookie
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
    return (getCookie(cname).length > 1);
}


function getCookie(cname) {
    // get cookie
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}


function sendPostHTTPRequest(url, userInput){
    // fetch using post
    return $.post(url, userInput)
    .done(function (data) {
        return (data.message !== undefined) ? data : {};
    })
    .fail(function (data) {
        let message = (data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.message || "Unable to access server.";
        return {errored: true, message}
    });
}


function sendGetHTTPRequest(url, userInput){
    // fetch using get
    return $.get(url, userInput)
    .done(function (data) {
        return (data.message !== undefined) ? data : {};
    })
    .fail(function (data) {
        let message = (data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.message || "Unable to access server.";
        return {errored: true, message}
    });
}