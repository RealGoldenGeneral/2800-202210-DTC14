current_slide = 0

function show_prev_quiz_info() {
    $(".quiz_score_info").hide()
    slides = $(".quiz_info_slideshow_container").children(".quiz_score_info")
    if (current_slide <= 0) {
        current_slide = slides.length - 1
        $(slides[current_slide]).show()
    }
    else {
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
    if (current_slide >= (slides.length - 1)) {
        current_slide = 0
        console.log("at highest slide")
        $(slides[current_slide]).show()
    }
    else {
        current_slide += 1
        $(slides[current_slide]).show()
    }
}

function setup() {
    $(".quiz_score_info").hide()
    $("#covid_safety").show()
    $(".next").click(show_next_quiz_info)
    $(".prev").click(show_prev_quiz_info)

}

$(document).ready(setup)