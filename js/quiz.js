function move_to_quiz_screen() {
    location.href = `/startQuiz`
}

////
// Referenced the slideshow how-to from W3Schools, can be found here: https://www.w3schools.com/howto/howto_js_slideshow.asp
// All code was changed to use jQuery events and handlers instead, no inline js, event handling is done in js file
// Code was divided into two functions, one for clicking previous and one for clicking next

// defaulting current slide to 0, which is start of array
current_slide = 0

function show_prev_quiz_info() {
    // hide all intitally
    $(".quiz_score_info").hide()
    // removeClass and addClass for css animations
    $(".quiz_score_info").removeClass("slide_right")
    $(".quiz_score_info").addClass("slide_left")
    // gets array of child elemenents of class quiz_info_slideshow_container who have class, quiz_score_info
    slides = $(".quiz_info_slideshow_container").children(".quiz_score_info")
    // to make sure you don't go to index, -1 and below
    if (current_slide <= 0) {
        current_slide = slides.length - 1
        // display HTML of the child at index X of the array
        $(slides[current_slide]).show()
    }
    else {
        // subtract indexing value since it is previous 
        current_slide -= 1
        $(slides[current_slide]).show()
    }
}

function show_next_quiz_info() {
    slides = $(".quiz_info_slideshow_container").children(".quiz_score_info")
    console.log($(".quiz_info_slideshow_container").children(".quiz_score_info"))
    console.log(slides[0])
    console.log(slides[1])
    $(".quiz_score_info").hide()
    $(".quiz_score_info").removeClass("slide_left")
    $(".quiz_score_info").addClass("slide_right")
    // to make sure you don't go above max index of the array
    if (current_slide >= (slides.length - 1)) {
        // return to first slide if press next at last slide
        current_slide = 0
        console.log("at highest slide")
        $(slides[current_slide]).show()
    }
    else {
        // add 1 to indexing value since it is next
        current_slide += 1
        $(slides[current_slide]).show()
    }
}
////

function covid_safety_quiz_scores(quiz) {
    if (quiz.category == "covid_safety") {
        return quiz
    }
}

function covid_info_quiz_scores(quiz) {
    if (quiz.category == "covid_information") {
        return quiz
    }
}

function load_high_and_previous_scores(data) {
    console.log(data)
    quiz_scores = data[0].quiz_scores
    console.log(quiz_scores)
    covid_safety = quiz_scores.filter(covid_safety_quiz_scores) 
    covid_info = quiz_scores.filter(covid_info_quiz_scores)
    console.log(covid_safety, covid_info)
    $("#covid_safety .quiz_high_score").text(covid_safety[0].high_score)
    $("#covid_safety .quiz_prev_score").text(covid_safety[0].previous_score)
    $("#covid_virus .quiz_high_score").text(covid_info[0].high_score)
    $("#covid_virus .quiz_prev_score").text(covid_info[0].previous_score)
}

function grab_high_and_previous_score() {
    $.ajax(
        {
            "url": "/getQuizScores",
            "type": "GET",
            "success": load_high_and_previous_scores
        }
    )
}

function reformat_title(data) {
    console.log(data)
    split_category_title = data[0].category.split("_")
    console.log(split_category_title)
    for (i = 0; i < split_category_title.length; i++) {
        split_category_title[i] = split_category_title[i].slice(0, 1).toUpperCase() + split_category_title[i].slice(1)
    }
    $(".quiz_start_container .quiz_category").text(split_category_title.join(" "))
}

function change_quiz_category_title() {
    $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": reformat_title
        }
    )
}

function setup() {
    // hiding and showing defaulted quiz info section
    $(".quiz_score_info").hide()
    $("#covid_safety").show()
    grab_high_and_previous_score()
    change_quiz_category_title()
    $(".next").click(show_next_quiz_info)
    $(".prev").click(show_prev_quiz_info)
    $(".quiz_start_button").click(move_to_quiz_screen)
}

$(document).ready(setup)