current_questions = ""
current_question = 0
user_quiz_score = 0

function display_correct_answer_only(choice) {
    return choice.choice
}

function grab_correct_answers(choice) {
    if (choice.type == "correct") {
        return choice
    }
}

function get_current_quiz_question_answers(chosen_answer) {
    console.log(current_questions[current_question].choices)
    correct_answers = current_questions[current_question].choices.filter(grab_correct_answers)
    correct_answers = correct_answers.map(display_correct_answer_only)
    console.log(correct_answers)
    if (correct_answers.includes(chosen_answer)) {
        user_quiz_score += 1
        console.log(user_quiz_score)
    }
}

function update_user_score() {
    $.ajax(
        {
            "url": "/updateUserQuizScore",
            "type": "POST",
            "data": {
                "score": user_quiz_score,
                "category": ""
            }
        }
    )
}

//placeholder for now, will work on it later
function display_end_screen() {
    update_user_score()
    $(".play_quiz_container").html("")
}

function move_to_next_question() {
    get_current_quiz_question_answers($(this).attr("id"))
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
    $(".play_quiz_question p").text(current_questions[current_question].question)
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
    split_category_title = data[0].category.split("_")
    console.log(split_category_title)
    for (i = 0; i < split_category_title.length; i++) {
        split_category_title[i] = split_category_title[i].slice(0, 1).toUpperCase() + split_category_title[i].slice(1)
    }
    console.log(split_category_title)
    $(".title div:nth-child(2) h2").text(split_category_title.join(" "))
    console.log(current_questions)
    start_quiz()
}

function get_quiz_questions(data) {
    console.log(data)
}

function grab_current_quiz_category_questions() {
    $.ajax(
        {
            "url": "/getSelecetedCategory",
            "type": "GET",
            "success": get_quiz_questions
        }
    )

    // $.ajax(
    //     {
    //         // need to get quiz category later on
    //         "url": "/findQuizQuestions",
    //         "type": "POST",
    //         "success": store_quiz_questions
    //     }
    // )
}

function setup() {
    grab_current_quiz_category_questions()
    $("body").on("click", ".play_quiz_choice", move_to_next_question)
}

$(document).ready(setup)