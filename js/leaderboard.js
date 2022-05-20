to_add = ''

function fillScoreboardQuiz() {
    $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) => {
            $("#leaderboard").empty()
            to_add = ''
            for (i = 0; i < data.length; i++) {
                to_add += `<div class="score">
                <h4>${i + 1}. ${data[i].name}/h4>
                <h4>${data[i].high_score}</h4>
                </div>`
            }
            $("#leaderboard").html(to_add)
        }
    })
}

function fillScoreboardGame() {
    $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) => {
            $("#leaderboard").empty()
            console.log(data)
            to_add = ''
            for (i = 0; i <= data.length; i++) {
                to_add += `<div class="score">
                <h4>${i + 1}. ${data[i].name}</h4>
                <h4>${data[i].score}</h4>
                </div>`
            }
            $("#leaderboard").html(to_add);
        }
    })
}

function setup() {
    $("#gameToggle").click(() => {
        fillScoreboardGame();
    })

    $("#quizToggle").click(() => {
        fillScoreboardQuiz();
    })

    $("#submit").click(() => {
        if ($("#search").val() == "Roy Cheng") {
            fillScoreboardGame();
        }
    })
}

$(document).ready(setup)