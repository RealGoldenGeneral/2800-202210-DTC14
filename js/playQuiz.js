currentQuestions = ""
currentQuestion = 0
userQuizScore = 0
selectedCategory = ""
userInfo = ""
correct = []
incorrect = []

function returnToQuizHome() {
    console.log("activated")
    location.href = "/quiz"
}

function expandThisAccordian() {
    $(".expand_accordian").removeClass("fa-minus")
    $(".expand_accordian").addClass("fa-plus")
    if ($(this).parent().find(".play_quiz_end_accordian_answer").css("display") == "none") {
        $(".play_quiz_end_accordian_answer").hide()
        $(this).parent().find(".expand_accordian").removeClass("fa-plus")
        $(this).parent().find(".expand_accordian").addClass("fa-minus")
        $(this).parent().find(".play_quiz_end_accordian_answer").show()
    }   
    else {
        $(this).parent().find(".expand_accordian").removeClass("fa-minus")
        $(this).parent().find(".expand_accordian").addClass("fa-plus")
        $(this).parent().find(".play_quiz_end_accordian_answer").hide()
    }
}

function getCorrectOnly(data) {
    if (data.type == "correct") {
        return data
    }
}

function getAnswersOfQuestion(question) {
    answers = ""
    thisQuestion = currentQuestions.filter(function(data) {
        if (data.question == question) {
            return data
        }
    });
    thisQuestion = thisQuestion[0].choices.filter(getCorrectOnly)
    console.log("questoin", thisQuestion)
    if (thisQuestion.length == 1) {
        return thisQuestion[0].choice
    }
    else {
        for (answer = 0; answer < thisQuestion.length; answer++) {
            answers += `<p>${thisQuestion[answer].choice}</p>`
        }
        return answers
    }
}

function buildQuestionAccordians() {
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
        accordian += `<i class="fa-solid fa-plus expand_accordian"></i>`
        accordian += `<div class="play_quiz_end_accordian_answer">`
        accordian += `<p><b>Correct Answer(s)</b></p>`
        accordian += getAnswersOfQuestion(incorrect[i].question)
        accordian += `</div>` 
        accordian += `</div>`
    }
    // return it all
    return accordian
}

function displayCorrectAnswerOnly(choice) {
    return choice.choice
}

function grabCorrectAnswers(choice) {
    if (choice.type == "correct") {
        return choice
    }
}

function getCurrentQuizQuestionAnswers(chosenAnswer) {
    console.log(currentQuestions[currentQuestion].choices)
    correctAnswers = currentQuestions[currentQuestion].choices.filter(grabCorrectAnswers)
    correctAnswers = correctAnswers.map(displayCorrectAnswerOnly)
    console.log(correctAnswers)
    if (correctAnswers.includes(chosenAnswer)) {
        correct.push(currentQuestions[currentQuestion])
        userQuizScore += 1
        console.log(userQuizScore)
    }
    else {
        incorrect.push(currentQuestions[currentQuestion])
    }
}

function getSelectedCategoryScore(data) {
    if (data.category == selectedCategory) {
        return data
    }
}

function updateUserScore(data) {
    userInfo = data
    console.log(data)
    console.log(selectedCategory)
    quizScore = data[0].quiz_scores.filter(getSelectedCategoryScore)
    if (userQuizScore > quizScore[0].high_score) {
        $.ajax(
            {
                "url": "/updateUserQuizScore",
                "type": "POST",
                "data": {
                    "score": userQuizScore,
                    "category": selectedCategory
                }
            }
        )
    }
}

async function getUserScore() {
    await $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": updateUserScore
        }
    )
}

//placeholder for now, will work on it later
async function displayEndScreen() {
    console.log("correct",correct)
    console.log("incorrect",incorrect)
    userInfo = ""
    await $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": function(data) {
                userInfo = data
            }
        }
    )
    getUserScore()
    highScoreInDb = userInfo[0].quiz_scores.filter(getSelectedCategoryScore)
    highScoreInDb = highScoreInDb[0].high_score
    $(".play_quiz_container").html("")
    endScreen = ""
    endScreen += `<div class="play_quiz_end_title">`
    endScreen += `<h4>You made it to the end!</h4>`
    endScreen += `</div>`

    endScreen += `<div class="play_quiz_end_info">`
    
    endScreen += `<div class="play_quiz_end_score_info">`
    
    endScreen += `<div class="play_quiz_end_high_score">`
    endScreen += `<p><i class="fa-solid fa-trophy"></i> High Score</p>`
    endScreen += `<p>${highScoreInDb}</p>`
    endScreen += `</div>`
    
    endScreen += `<div class="play_quiz_end_current_score">`
    endScreen += `<p>Current Score</p>`
    endScreen += `<p>${userQuizScore}</p>`
    endScreen += `</div>`
    
    endScreen += `<div class="play_quiz_end_question_title"><p>Questions</p></div>`
    endScreen += `<div class="play_quiz_end_questions_container">`

    endScreen += `<div class="play_quiz_end_questions_accordians">`
    endScreen += buildQuestionAccordians()
    endScreen += `</div>`

    endScreen += `</div>`

    endScreen += `<div class="play_quiz_end_menu_controls">`
    endScreen += `<div class="play_quiz_end_return_button">`
    endScreen += `<p>Go Back To Quiz Screen</p>`
    endScreen += `</div>`
    
    endScreen += `</div>`

    endScreen += `</div>`
    
    endScreen += `</div>`
    old = $(".play_quiz_container").html()
    $(".play_quiz_container").html(old + endScreen)
    $(".play_quiz_end_accordian_answer").hide()
}

function moveToNextQuestion() {
    getCurrentQuizQuestionAnswers($(this).attr("id"))
    currentQuestion += 1
    if (currentQuestion >= 10) {
        displayEndScreen()
    }
    else {
        $(".play_quiz_answer_container").html("")
        startQuiz()
    }
}

function startQuiz() {
    $(".play_quiz_question p").text(currentQuestions[currentQuestion].question)
    for (i = 0; i < currentQuestions[currentQuestion].choices.length; i++) {
        displayedChoice = ""
        displayedChoice += `<div class="play_quiz_choice" id="${currentQuestions[currentQuestion].choices[i].choice}"`
        displayedChoice += `<p>${currentQuestions[currentQuestion].choices[i].choice}</p>`
        displayedChoice += "</div>"
        old = $(".play_quiz_answer_container").html()
        $(".play_quiz_answer_container").html(old + displayedChoice)
    }
}

function storeQuizQuestions(data) {
    console.log("quiz questions of selected category", data)
    currentQuestions = data[0].questions
    // the formatted category string in db: covid_safety
    // split string by _
    categoryTitle = data[0].category.split("_")
    console.log(categoryTitle)
    // loop through ['covid', 'safety']
    for (i = 0; i < categoryTitle.length; i++) {
        // set new string of each index to it's capitalized form
        // slice first letter and capitalize and concatentate with rest of string in lowercase
        categoryTitle[i] = categoryTitle[i].slice(0, 1).toUpperCase() + categoryTitle[i].slice(1)
    }
    console.log(categoryTitle)
    // join ['Covid', 'Safety'] array elements with space in bewtween: Covid Safety
    $(".title div:nth-child(2) h2").text(categoryTitle.join(" "))
    console.log(currentQuestions)
    startQuiz()
}

function getQuizQuestions(data) {
    console.log("retrieved user stuff", data)
    selectedCategory = data[0].category
    $.ajax(
        {
            "url": "/findQuizQuestions",
            "type": "POST",
            "data": {
                "category": data[0].category
            },
            "success": storeQuizQuestions
        }
    )
}

function grabCurrentQuizCategoryQuestions() {
    $.ajax(
        {
            "url": "/getSelectedCategory",
            "type": "GET",
            "success": getQuizQuestions
        }
    )
}

function setup() {
    grabCurrentQuizCategoryQuestions()
    $("body").on("click", ".play_quiz_choice", moveToNextQuestion)
    $("body").on("click", ".expand_accordian", expandThisAccordian)
    $("body").on("click", ".play_quiz_end_return_button", returnToQuizHome)
}

$(document).ready(setup)