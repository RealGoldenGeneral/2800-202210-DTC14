increment = 0
clicks = 0

function removeUser() {
    if (clicks == 0) {
        $(".buttons").append("<p>Are you sure you want to delete this user? This action CANNOT be undone. Press Delete User again to confirm.</p>")
        clicks++;
    } else {
        $.ajax({
            type: "delete",
            url: "/removeUser",
            success: () => {
                clicks = 0
                location.reload()
            }
        })
    }
}

function modifyProfileInformation() {
    $.ajax({
        type: "post",
        url: "/updateUserInfo",
        data: {
            new_username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            phone: $("#phone").val()
        },
        success: () => {
            $(".card-body").append("<p>Successfully added information.</p>")
            $("#username").val("")
            $("#password").val("")
            $("#email").val("")
            $("#phone").val("")
        }
    })
}

function displayProfileModification() {
    $(".modifyProfile").empty()
    $("main").append(` <div class="modifyProfile">
    <div class="card">
    <div class="card-header">
    <h3>Edit Profile</h3>
    </div>
    <div class="card-body">
    <div class="form">
    <label for="username">Edit Username:</label>
    <input type="text" id="username" name="username">
    <label for="password">Edit Password:</label>
    <input type="password" id="password name="password">
    <label for="email">Edit Email Address: </label>
    <input type="email" id="email" name="email">
    <label for="phone">Edit Phone Number: </label>
    <input type="tel" id="phone" name="phone">
    <div class="buttons">
    <input type="submit" id="submit">
    <button id="delete">Delete User</button>
    </div>
    </div>
    </div>
    </div>
    </div>`)
}

function displayAllQuizScores() {
    $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) => {
            $("main").empty()
            $("main").append(`<div class="card">
            <div class="card-header">
            <h3>All Quiz Scores</h3>
            </div>
            <div class="card-body">
            <div class="table-responsive">
            <table width="100%">
            <thead>
            <tr>
            <td>Username</td>
            <td>Category</td>
            <td>Status</td>
            </tr>
            </thead>
            <tbody>
            </tbody>
            </table>
            </div>
            </div>`)
            for (m = 0; m < data.length; m++) {
                for (n = 0; n < data[m].quiz_scores.length; n++) {
                    if (data[m].quiz_scores[n].high_score >= 5) {
                        $("tbody").append(`<tr>
                        <td>${data[m].name}</td>
                        <td>${data[m].quiz_scores[n].category}</td>
                        <td>
                        <span class="status green"></span>
                        Passed
                        </td>
                        </tr>`)
                    } else if (data[m].quiz_scores[n].tried_quiz == false) {
                        $("tbody").append(`<tr>
                        <td>${data[m].name}</td>
                        <td>${data[m].quiz_scores[n].category}</td>
                        <td>
                        Incomplete
                        </td>
                        </tr>`)
                    }
                     else {
                        $("tbody").append(`<tr>
                        <td>${data[m].name}</td>
                        <td>${data[m].quiz_scores[n].category}</td>
                        <td>
                        <span class="status red"></span>
                        Failed
                        </td>
                        </tr>`)
                    }
                }
            }
            $("#dashboard").removeAttr("class")
            $("#accounts").removeAttr("class")
            $("#scores").attr("class", "active")
        }
    })
}

function displayAllUsers() {
    $.ajax({
        type: "get",
        url: "/getUsers",
        success: (data) => {
            $("main").empty()
            $("main").append(`<div class="card">
            <div class="card-header">
            <h3>All Users</h3>
            </div>
            <div class="card-body">
            <div class="customer">
            </div>
            </div>`)
            for (l = 0; l < data.length; l++) {
                $(".customer").append(`<div class="info">
                <div>
                <img src="${data[l].img}" width="40px" height="40px" alt="">
            </div>
            <div>
                <h4>${data[l].username}</h4>
                <small>${data[l].education}</small>
            </div>
            </div>
            <div class="contact">
                <span class="las la-user-circle"></span>
            </div>`)
            }
            $("#dashboard").removeAttr("class")
            $("#scores").removeAttr("class")
            $("#accounts").attr("class", "active")
        }
    })
}

function displayUsers() {
    $.ajax({
        type: "get",
        url: "/getUsers",
        success: (data) => {
            if (data.length == 1) {
                increment = 1
            }
            if (data.length == 2) {
                increment = 2
            }
            if (data.length > 3) {
                increment = 3
            }
            for (k = (data.length - increment); k < data.length; k++) {
                $(".customer").append(`
                <div class="info">
                <div>
                <img src="${data[k].img}" width="40px" height="40px" alt="">
            </div>
            <div>
                <h4>${data[k].username}</h4>
                <small>${data[k].education}</small>
            </div>
            </div>
            <div class="contact">
                <span class="las la-user-circle"></span>
            </div>`)
            }
        }
    })
}

function displayScores() {
    $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) => {
            if (data.length == 1) {
                increment = 1
            }
            if (data.length == 2) {
                increment = 2
            }
            if (data.length > 3) {
                increment = 3
            }
            for (i = (data.length - increment); i < data.length; i++) {
                for (j = 0; j < data[i].quiz_scores.length; j++) {
                    if (data[i].quiz_scores[j].high_score >= 5) {
                        $("tbody").append(`<tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].quiz_scores[j].category}</td>
                        <td>
                        <span class="status green"></span>
                        Passed
                        </td>
                        </tr>`)
                    } else if (data[i].quiz_scores[j].tried_quiz == false) {
                        $("tbody").append(`<tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].quiz_scores[j].category}</td>
                        <td>
                        Incomplete
                        </td>
                        </tr>`)
                    }
                     else {
                        $("tbody").append(`<tr>
                        <td>${data[i].name}</td>
                        <td>${data[i].quiz_scores[j].category}</td>
                        <td>
                        <span class="status red"></span>
                        Failed
                        </td>
                        </tr>`)
                    }
                }
            }
        }
    })
}

function addRecords() {
    $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) =>{
            record = 0
            for (i = 0; i < data.length; i++) {
                if (data[i].score > record) {
                    record = data[i].score
                }
            }
            $("#record").text(record)
        }
    })
}


function addUsers() {
    $.ajax({
        type: "get",
        url: "/getUsers",
        success: (data) => {
            $("#userCount").text(data.length)
        }
    })
}


function setup() {
    addUsers();
    addRecords();
    displayScores();
    displayUsers();
    $("#seeAllUsers").click(() => {
        displayAllUsers()
    })
    $("#accounts").click(() => {
        displayAllUsers()
    })
    $("#seeAllScores").click(() => {
        displayAllQuizScores()
    })
    $("#scores").click(() => {
        displayAllQuizScores()
    })
    $("body").on("click", ".contact", displayProfileModification);
    $("body").on("click", "#submit", modifyProfileInformation);
    $("body").on("click", "#delete", removeUser)
}

$(document).ready(setup)