to_add = ''

function fillScoreboardQuiz() {
    $.ajax({
        type: "get",
        url: "/getQuizRecords",
        success: (data) => {
            console.log(data)
            $("#leaderboard").empty()
            to_add = ''
            for (i = 0; i < data.length; i++) {
                to_add += `<div class="score">
                <h4>${data[i].username}</h4>
                <h4>${data[i].quiz_scores[0].high_score}</h4>
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
            console.log(data[0].name)
            to_add = ''
            for (i = 0; i < data.length; i++) {
                to_add += `<div class="score"><h4>${data[i].name}</h4><h4>${data[i].score}</h4></div>`
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
}

$(document).ready(setup)