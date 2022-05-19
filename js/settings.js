function registerNewEmail(newEmail) {
    $.ajax({
        type: "post",
        data: {
            email: newEmail
        },
        url: '/changeEmail'
    })
}


function registerNewPassword(newPassword) {
    $.ajax({
        type: "post",
        data: {
            password: newPassword
        },
        url: '/changePassword'
    })
}

function registerNewUsername(newUsername) {
    $.ajax({
        type: "post",
        data: {
            username: newUsername
        },
        url: '/changeUsername'
    })
}


function setup() {
    $("#usernameSubmit").click(() => {
        newUsername = $("#username").val();
        if (newUsername != '') {
            registerNewUsername(newUsername);
        } else {
            $("#usernameOption").append("<p>Name cannot be blank.</p>")
        }
    })
    $("#passwordSubmit").click(() => {
        newPassword = $("#password").val();
        if (newPassword != '') {
            registerNewPassword(newPassword);
        } else {
            $("#passwordOption").append("<p>Name cannot be blank.</p>")
        }
    })
    $("#emailSubmit").click(() => {
        newEmail = $("#email").val();
        if (newEmail != '') {
            registerNewEmail(newEmail);
        } else {
            $("#emailOption").append("<p>Name cannot be blank.</p>")
        }
    })
}


$(document).ready(setup)