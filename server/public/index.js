function process_response(data) {
    console.log(data)
}

function listenToClick() {
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "http://localhost:5005/login",
            data: {
                name: $("#username").val(),
                password: $("#password").val()
            },
            success: process_response
        })
    })
}

$(document).ready(listenToClick)