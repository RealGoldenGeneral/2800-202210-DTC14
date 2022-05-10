to_add = ''

function fillScoreboardQuiz() {
    $("#leaderboard").empty()
    to_add = ''
    j = 10
    for (i = 1; i <= 10; i++) {
        to_add += `<div class="score">
        <h4>${i}. Roy Cheng</h4>
        <h4>${j}</h4>
        </div>`
        j--
    }
    $("#leaderboard").html(to_add)
}

function fillScoreboardGame() {
    $("#leaderboard").empty()
    to_add = ''
    j = 10
    for(i = 1; i <= 10; i++) {
        num = 10000 * j
        to_add += `<div class="score">
        <h4>${i}. Roy Cheng</h4>
        <h4>${num}</h4>
        </div>`
        j--
    }
    $("#leaderboard").html(to_add);
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