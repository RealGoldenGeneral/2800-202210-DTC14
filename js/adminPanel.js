
increment = 0
clicks = 0
to_add = ''

function changeUserInfo() {
    $.ajax({
        type: "get",
        url: "/getCurrentUser",
        success: (data) => {
            $(".user-wrapper").append(`<div>
            <h4>${data[0].username}</h4>
            <small>${data[0].type}</small>
            </div>`)
        }
    })
}

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
    adminPanelUsername = $(this).find(".info").find("div:nth-child(2) h4").text()
    $(".modifyProfile").empty()
    $("main").append(` <div class="modifyProfile">
    <div class="card">
    <div class="card-header">
    <h3>Edit Profile for ${adminPanelUsername}</h3>
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

async function displayAllQuizScores() {
    await $.ajax({
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
            <td>Score</td>
            </tr>
            </thead>
            <tbody>
            </tbody>
            </table>
            </div>
            </div>`)
                for (m = 0; m < data.length; m++) {
                    for (n = 0; n < data[m].quiz_scores.length; n++) {
                        if (data[m].quiz_scores[n].tried_quiz == true) {
                            $("tbody").append(`<tr>
                            <td>${data[m].username}</td>
                            <td>${data[m].quiz_scores[n].category}</td>
                            <td>
                            ${data[m].quiz_scores[n].high_score}/10
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
     await $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) => {
             for (p = 0; p < data.length; p++) {
                $("tbody").append(`<tr>
                <td>${data[p].name}</td>
                <td>game</td>
                <td>${data[p].score}</td>
                </tr>`)
            }
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
                $(".customer").append(`<div class="user">
                <div class="info">
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
            </div>
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
                $(".customer").append(`<div class="user">
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
            </div>
            </div>`)
            }
        }
    })
}

async function displayScores() {
    q = 0
    await $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) => {
            if (data.length == 1) {
                increment = 2
            }
            if (data.length == 2) {
                increment = 4
            }
            if (data.length > 3) {
                increment = 6
            } for (i = 0; i < data.length; i++) {
                for (j = 0; j < data[i].quiz_scores.length; j++) {
                    if (data[i].quiz_scores[j].tried_quiz == true) {
                        if (q != increment) {
                            to_add += `<tr>
                            <td>${data[i].username}</td>
                            <td>${data[i].quiz_scores[j].category}</td>
                            <td>
                            ${data[i].quiz_scores[j].high_score}/10
                            </td>
                            </tr>`
                            q++
                            }
                        }
                    }
                }
                $("tbody").append(to_add)
            }
        })

    await $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) => {
            if (data.length == 1) {
                increment = 1
            }
            if (data.length == 2) {
                increment = 2
            }
            if (data.length > 3) {
                increment = 3
            } for (o = (data.length - increment); o < data.length; o++) {
                $("tbody").append(`<tr>
                <td>${data[o].name}</td>
                <td>game</td>
                <td>${data[o].score}</td>
                </tr>`)
            }
        }
    })
}

async function addRecords() {
    records = 0
    await $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) =>{
            records += data.length * 2
        }
    })
    await $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) => {
            records += data.length
        }
    })
    $("#record").text(records)
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
    changeUserInfo();
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
    $("body").on("click", ".user", displayProfileModification);
    $("body").on("click", "#submit", modifyProfileInformation);
    $("body").on("click", "#delete", removeUser)
}

$(document).ready(setup)