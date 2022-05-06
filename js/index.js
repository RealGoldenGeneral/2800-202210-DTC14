function listenToClick() {
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "./server/server.js",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            }
        })
    })
}