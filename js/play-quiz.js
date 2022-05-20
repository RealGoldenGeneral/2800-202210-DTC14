current_questions = ""
current_question = 0
user_quiz_score = 0
selected_category = ""
user_info = ""

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

function get_selected_category_score(data) {
    if (data.category == selected_category) {
        return data
    }
}

function update_user_score(data) {
    user_info = data
    console.log(data)
    console.log(selected_category)
    quiz_score = data[0].quiz_scores.filter(get_selected_category_score)
    if (user_quiz_score > quiz_score[0].high_score) {
        $.ajax(
            {
                "url": "/updateUserQuizScore",
                "type": "POST",
                "data": {
                    "score": user_quiz_score,
                    "category": selected_category
                }
            }
        )
    }
}

async function get_user_score() {
    await $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": update_user_score
        }
    )
}

//placeholder for now, will work on it later
async function display_end_screen() {
    user_info = ""
    await $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": function(data) {
                user_info = data
            }
        }
    )
    get_user_score()
    high_score_in_db = user_info[0].quiz_scores.filter(get_selected_category_score)
    high_score_in_db = high_score_in_db[0].high_score
    $(".play_quiz_container").html("")
    end_screen = ""
    end_screen += `<div class="play_quiz_end_title">`
    end_screen += `<h4>You made it to the end!</h4>`
    end_screen += `</div>`

    end_screen += `<div class="play_quiz_end_info">`
    
    end_screen += `<div class="play_quiz_end_score_info">`
    
    end_screen += `<div class="play_quiz_end_high_score">`
    end_screen += `<p><i class="fa-solid fa-trophy"></i> High Score</p>`
    end_screen += `<p>${high_score_in_db}</p>`
    end_screen += `</div>`
    
    end_screen += `<div class="play_quiz_end_current_score">`
    end_screen += `<p>Current Score</p>`
    end_screen += `<p>${user_quiz_score}</p>`
    end_screen += `</div>`
    
    end_screen += `<div class="play_quiz_end_questions_container">`
    // accordians of questions, coloured in red and green 
    end_screen += `<p>Placeholder</p>`
    end_screen += `</div>`

    end_screen += `<div class="play_quiz_end_menu_controls">`
    end_screen += `<div class="play_quiz_end_return_button">`
    end_screen += `<p>Go Back To Quiz Screen</p>`
    end_screen += `</div>`
    
    end_screen += `</div>`

    end_screen += `</div>`
    
    end_screen += `</div>`
    old = $(".play_quiz_container").html()
    $(".play_quiz_container").html(old + end_screen)
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
    console.log("quiz questions of selected category", data)
    current_questions = data[0].questions
    // the formatted category string in db: covid_safety
    // split string by _
    split_category_title = data[0].category.split("_")
    console.log(split_category_title)
    // loop through ['covid', 'safety']
    for (i = 0; i < split_category_title.length; i++) {
        // set new string of each index to it's capitalized form
        // slice first letter and capitalize and concatentate with rest of string in lowercase
        split_category_title[i] = split_category_title[i].slice(0, 1).toUpperCase() + split_category_title[i].slice(1)
    }
    console.log(split_category_title)
    // join ['Covid', 'Safety'] array elements with space in bewtween: Covid Safety
    $(".title div:nth-child(2) h2").text(split_category_title.join(" "))
    console.log(current_questions)
    start_quiz()
}

function get_quiz_questions(data) {
    console.log("retrieved user stuff", data)
    selected_category = data[0].category
    $.ajax(
        {
            // need to get quiz category later on
            "url": "/findQuizQuestions",
            "type": "POST",
            "data": {
                "category": data[0].category
            },
            "success": store_quiz_questions
        }
    )
}

function grab_current_quiz_category_questions() {
    $.ajax(
        {
            "url": "/getSelectedCategory",
            "type": "GET",
            "success": get_quiz_questions
        }
    )
}

function setup() {
    grab_current_quiz_category_questions()
    $("body").on("click", ".play_quiz_choice", move_to_next_question)
}

$(document).ready(setup)