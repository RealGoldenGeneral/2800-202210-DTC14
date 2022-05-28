function moveToQuizScreen() {
    location.href = `/startQuiz`
}

////
// Referenced the slideshow how-to from W3Schools, can be found here: https://www.w3schools.com/howto/howto_js_slideshow.asp
// All code was changed to use jQuery events and handlers instead, no inline js, event handling is done in js file
// Code was divided into two functions, one for clicking previous and one for clicking next

// defaulting current slide to 0, which is start of array
currentSlide = 0

function showPrevQuizInfo() {
    // hide all intitally
    $(".quiz_score_info").hide()
    // removeClass and addClass for css animations
    $(".quiz_score_info").removeClass("slide_right")
    $(".quiz_score_info").addClass("slide_left")
    // gets array of child elemenents of class quiz_info_slideshow_container who have class, quiz_score_info
    slides = $(".quiz_info_slideshow_container").children(".quiz_score_info")
    // to make sure you don't go to index, -1 and below
    if (currentSlide <= 0) {
        currentSlide = slides.length - 1
        // display HTML of the child at index X of the array
        $(slides[currentSlide]).show()
    }
    else {
        // subtract indexing value since it is previous 
        currentSlide -= 1
        $(slides[currentSlide]).show()
    }
}

function showNextQuizInfo() {
    slides = $(".quiz_info_slideshow_container").children(".quiz_score_info")
    console.log($(".quiz_info_slideshow_container").children(".quiz_score_info"))
    console.log(slides[0])
    console.log(slides[1])
    $(".quiz_score_info").hide()
    $(".quiz_score_info").removeClass("slide_left")
    $(".quiz_score_info").addClass("slide_right")
    // to make sure you don't go above max index of the array
    if (currentSlide >= (slides.length - 1)) {
        // return to first slide if press next at last slide
        currentSlide = 0
        console.log("at highest slide")
        $(slides[currentSlide]).show()
    }
    else {
        // add 1 to indexing value since it is next
        currentSlide += 1
        $(slides[currentSlide]).show()
    }
}
////

function covidSafetyQuizScores(quiz) {
    if (quiz.category == "covid_safety") {
        return quiz
    }
}

function covidInfoQuizScores(quiz) {
    if (quiz.category == "covid_information") {
        return quiz
    }
}

function loadHighScores(data) {
    console.log(data)
    quizScores = data[0].quiz_scores
    console.log(quizScores)
    covidSafety = quizScores.filter(covidSafetyQuizScores) 
    covidInfo = quizScores.filter(covidInfoQuizScores)
    console.log(covidSafety, covidInfo)
    $("#covid_safety .quiz_high_score").text(covidSafety[0].high_score)
    $("#covid_virus .quiz_high_score").text(covidInfo[0].high_score)
}

function grabHighScore() {
    $.ajax(
        {
            "url": "/getQuizScores",
            "type": "GET",
            "success": loadHighScores
        }
    )
}

function reformatTitle(data) {
    console.log(data)
    categoryTitle = data[0].category.split("_")
    console.log(categoryTitle)
    for (i = 0; i < categoryTitle.length; i++) {
        categoryTitle[i] = categoryTitle[i].slice(0, 1).toUpperCase() + categoryTitle[i].slice(1)
    }
    $(".quiz_start_container .quiz_category").text(categoryTitle.join(" "))
}

function changeQuizCategoryTitle() {
    $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": reformatTitle
        }
    )
}

function setup() {
    // hiding and showing defaulted quiz info section
    $(".quiz_score_info").hide()
    $("#covid_safety").show()
    grabHighScore()
    changeQuizCategoryTitle()
    $(".next").click(showNextQuizInfo)
    $(".prev").click(showPrevQuizInfo)
    $(".quiz_start_button").click(moveToQuizScreen)
}

$(document).ready(setup)