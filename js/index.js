function listenToClick() {
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "./server.js",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            }
        })
    })
}

function setup() {
    listenToClick();
}

$(document).ready(setup)