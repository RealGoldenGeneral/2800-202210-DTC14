function process_response(data) {
    console.log(data)
}

// This code snippet was a portion the W3Schools Horizontal Tabs How-To
// Adds a class (the class is defined the index.css under the navbar section) 
// that will change the background colour to give the effect of showing the current tab.
// You can find it here: https://www.w3schools.com/howto/howto_js_tabs.asp
function show_active_nav_item() {
    // Removes the class from all navbar items
    $(".navbar-item").removeClass("active")
    // Adds the class to the recently clicked navbar item
    $(this).addClass("active")
}

function listenToClick() {
    console.log("loaded")
    $(".news-card").click(show_click_effect)
    $("body").on("click", ".navbar-item", show_active_nav_item)
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "https://localhost:5005/",
            data: {
                name: $("#username:text").val(),
                password: $("#password:text").val()
            },
            success: process_response
        })
    })
}

$(document).ready(listenToClick)