function processResponse(message) {
    console.log(message)
    // message = message.split(" ")
    // console.log(message)
    // if (message.includes("pattern:")) {
    //     console.log("hi")
    //     console.log("Please enter a phone number with proper format: XXX-XXX-XXXX.")
    //     $("#incorrect-signup").text("Please enter a phone number with proper format: XXX-XXX-XXXX.")
    // }
    // else {
    //     console.log(message.join(" "))
    //     $("#incorrect-signup").text(message.join(" ") + ".")
    // }

    // if ($("#username").val() == "covid") {
    //     $("form").append("<p>COVID is an invalid name.</p>")
    // } else {
    //     location.href = "/thanks"
    // }
}

function addAccount() {
    $.ajax({
        type: 'PUT',
        url: '/addNewUser',
        data: {
            name: `${$("#first_name").val()} ${$("#last_name").val()}`,
            email: $("#email").val(),
            username: $("#username").val(),
            password: $("#password").val(),
            phone: $("#phone_number").val(),
            education: $("#education").val()
        },
        success: processResponse
    })
}

function setup() {
    $("a").click(addAccount)
}

$(document).ready(setup)