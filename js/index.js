function process_response(data) {
    console.log(data)
}

function listenToClick() {
    console.log("loaded")
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "https://localhost:5005/",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            },
            success: process_response
        })
    })
}

$(document).ready(listenToClick)