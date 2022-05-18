current_questions = ""
current_question = 0

function display_end_screen() {
    $(".play_quiz_container").html("")
}

function move_to_next_question() {
    current_question += 1
    if (current_question >= 10) {
        display_end_screen()
    }
    else {
        $(".play_quiz_answer_container").html("")
        start_quiz()
    }
}

function start_quiz() {
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

function store_quiz_questions(data) {
    console.log(data)
    current_questions = data[0].questions
    $(".title div:nth-child(2)").text(data[0].category)
    console.log(current_questions)
    start_quiz()
}

function grab_current_quiz_category_questions() {
    $.ajax(
        {
            // need to get quiz category later on
            "url": "/findQuizQuestions",
            "type": "POST",
            "success": store_quiz_questions
        }
    )
}

function setup() {
    grab_current_quiz_category_questions()
    $("body").on("click", ".play_quiz_choice", move_to_next_question)
}

$(document).ready(setup)