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
        registerNewUsername(newUsername);
    })
}


$(document).ready(setup)