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

function load_high_and_previous_scores(data) {
    console.log(data)
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

function setup() {
    // hiding and showing defaulted quiz info section
    $(".quiz_score_info").hide()
    $("#covid_safety").show()
    grab_high_and_previous_score()
    $(".next").click(show_next_quiz_info)
    $(".prev").click(show_prev_quiz_info)
    $(".quiz_start_button").click(move_to_quiz_screen)
}

$(document).ready(setup)