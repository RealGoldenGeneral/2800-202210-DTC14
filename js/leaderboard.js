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
    $.ajax({
        type: "get",
        url: "/getRecords",
        success: (data) => {
            $("#leaderboard").empty()
            to_add = ''
            data.sort(function(a, b){return b - a}) //From W3 schools resources
            for(i = 1; i <= data.length; i++) {
                to_add += `<div class="score">
                <h4>${i}. ${data[i].num}</h4>
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