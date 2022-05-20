current_questions = ""
current_question = 0
user_quiz_score = 0
selected_category = ""
user_info = ""
correct = []
incorrect = []

function get_correct_only(data) {
    if (data.type == "correct") {
        return data
    }
}

function get_answers_of_question(question) {
    answers = ""
    this_question = current_questions.filter(function(data) {
        if (data.question == question) {
            return data
        }
    });
    this_question = this_question[0].choices.filter(get_correct_only)
    console.log("questoin", this_question)
    // for (i = 0; i < this_question[0].choices.length; i++) {
    //    answers += this_question[0].choices[i].choice 
    // }
    if (this_question.length == 1) {
        return this_question[0].choice
    }
    else {
        for (answer = 0; answer < this_question.length; answer++) {
            answers += `<p>${this_question[answer].choice}</p>`
        }
        return answers
    }
}

function build_question_accordians() {
    accordian = ""
    // build all the html
    // add class red green to highlight correct and incorrect answers
    // use question as the id
    for (i = 0; i < correct.length; i++) {
        accordian += `<div class="play_quiz_end_accordian_item correct" id="${correct[i].question}"`
        accordian += `<p>${correct[i].question}</p>` 
        accordian += `</div>`
    }
    for (i = 0; i < incorrect.length; i++) {
        accordian += `<div class="play_quiz_end_accordian_item incorrect" id="${incorrect[i].question}">`
        accordian += `<p>${incorrect[i].question}</p>`
        accordian += `<div class="play_quiz_end_accordian_answer">`
        accordian += get_answers_of_question(incorrect[i].question)
        accordian += `</div>` 
        accordian += `</div>`
    }
    // return it all
    return accordian
}

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
        correct.push(current_questions[current_question])
        user_quiz_score += 1
        console.log(user_quiz_score)
    }
    else {
        incorrect.push(current_questions[current_question])
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
    console.log("correct",correct)
    console.log("incorrect",incorrect)
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
    
    end_screen += `<div class="play_quiz_end_question_title"><p>Questions</p></div>`
    end_screen += `<div class="play_quiz_end_questions_container">`
    // accordians of questions, coloured in red and green 

    end_screen += `<div class="play_quiz_end_questions_accordians">`
    end_screen += build_question_accordians()
    end_screen += `</div>`

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