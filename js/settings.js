function processResponse() {
    alert("Successfully updated information.")
    location.reload()
}

function changeCategory(category){
    if (category == "covid_safety" || category == "covid_information") {
        $.ajax({
            type: "post",
            data: {
                category: category
            },
            url: "/changeQuizCategory",
            success: processResponse
        })
    }
}

function registerNewPhoneNumber(newPhoneNumber) {
    $.ajax({
        type: "post",
        data: {
            phone: newPhoneNumber
        }, 
        url: '/changePhoneNumber',
        success: processResponse
    })
}

function registerNewEmail(newEmail) {
    $.ajax({
        type: "post",
        data: {
            email: newEmail
        },
        url: '/changeEmail',
        success: processResponse
    })
}


function registerNewPassword(newPassword) {
    $.ajax({
        type: "post",
        data: {
            password: newPassword
        },
        url: '/changePassword',
        success: processResponse
    })
}

function registerNewUsername(newUsername) {
    $.ajax({
        type: "post",
        data: {
            username: newUsername
        },
        url: '/changeUsername',
        success: processResponse
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
    $("#passwordSubmit").click(() => {
        newPassword = $("#password").val();
        if (newPassword != '') {
            registerNewPassword(newPassword);
        } else {
            $("#passwordOption").append("<p>Name cannot be blank.</p>")
        }
    })
    $("#emailSubmit").click(() => {
        newEmail = $("#email").val();
        if (newEmail != '') {
            registerNewEmail(newEmail);
        } else {
            $("#emailOption").append("<p>Name cannot be blank.</p>")
        }
    })
    $("#phoneNumberSubmit").click(() => {
        newPhoneNumber = $("#phoneNumber").val();
        if (newPhoneNumber != '') {
            registerNewPhoneNumber(newPhoneNumber);
        } else {
            $("#phoneNumberOption").append("<p>Name cannot be blank.</p>")
        }
    })
    $("#categories").change(() => {
        changeCategory($("#categories").val())
    })
}

$(document).ready(setup)