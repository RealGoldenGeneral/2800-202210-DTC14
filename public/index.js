function process_response(data) {
    console.log("recieved back from server")
    console.log(`username: ${data["username"]}, password: ${data["password"]}`)
}

function listenToClick() {
    console.log("loaded")
    $(".login_button").click(function() {
        $.ajax({
            type: "POST",
            url: "http://localhost:5005/login",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            },
            success: process_response
        })
    })
}

$(document).ready(listenToClick)