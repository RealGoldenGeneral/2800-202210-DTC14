function listenToClick() {
    console.log("loaded")
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "https://localhost:5005/login2",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            }
        })
    })
}

$(document).ready(listenToClick)