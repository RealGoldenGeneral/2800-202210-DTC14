function start_quiz(data) {
    current_question = 1
    console.log(data)
    current_questions = data[0].questions
    console.log(current_questions)
    $(".play_quiz_question").text(current_questions[current_question].question)
    for (i = 0; i < current_questions[current_question].choices.length; i++) {
        displayed_choice = ""
        displayed_choice += `<div class="play_quiz_choice" id="${current_questions[current_question].choices[i].choice}"`
        displayed_choice += `<p>${current_questions[current_question].choices[i].choice}</p>`
        displayed_choice += "</div>"
        old = $(".play_quiz_answer_container").html()
        $(".play_quiz_answer_container").html(old + displayed_choice)
    }
}

function grab_current_quiz_category_questions() {
    $.ajax(
        {
            // need to get quiz category later on
            "url": "/findQuizQuestions",
            "type": "POST",
            "success": start_quiz
        }
    )
}

function setup() {
    grab_current_quiz_category_questions()
}

$(document).ready(setup)