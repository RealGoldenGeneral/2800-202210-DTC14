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
}


$(document).ready(setup)