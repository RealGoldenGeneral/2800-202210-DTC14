function start_quiz(data) {
    console.log(data)
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