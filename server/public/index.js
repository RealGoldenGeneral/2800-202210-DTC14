function process_response(data) {
    $("#incorrect-login").hide()
    console.log(data)
    if (data != "incorrect information") {
        location.href = "http://localhost:5005/welcome"
    } else {
        $("#incorrect-login").show()
    }
}

function listenToClick() {
    $("#incorrect-login").hide()
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