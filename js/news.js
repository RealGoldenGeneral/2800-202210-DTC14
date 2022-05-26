const date = new Date()

function close_article() {
    $("#full-news-article-card").remove()
    $("#real-news-container").css("grid-template-columns", "50% 50%")
    $(".news-card").show()
}

function load_selected_article(data) {
    console.log(data)
    $(".news-card").hide()
    full_article_template = document.getElementById("full-news-article")
    full_article_title = data[0].title
    full_article_image = data[0].img_url
    full_article_desc = data[0].description
    full_article_content = data[0].content
    full_article_link = data[0].url
    var clone = full_article_template.content.cloneNode(true)
    clone.querySelector("#full-article-title").innerHTML = full_article_title
    clone.querySelector("#full-article-image").src = full_article_image
    clone.querySelector("#full-article-desc").innerHTML = full_article_desc
    clone.querySelector("#full-article-content").innerHTML = full_article_content
    clone.querySelector("#full-article-link").href = full_article_link
    document.getElementById("real-news-container").appendChild(clone)
    $("#real-news-container").css({"display": "grid", 
                                   "grid-template-columns": "100%",
                                   })
}

function get_full_article_info() {
    title = $(this).find("h5").text()
    console.log(title)
    $.ajax(
        {
            "url": `/find_article`,
            "type": "POST",
            "data": {
                "title": title
            },
            "success": load_selected_article,
        }
    )
}

function load_news_cards(data) {
    // defining a template
    console.log(data)
    template = document.getElementById("news-article");
    article_title = document.getElementById("news-title")
    article_img = document.getElementById("news-img")
    for (i = 0; i < data.length; i++) {
        var clone = template.content.cloneNode(true);
        clone.querySelector("#news-title").innerHTML = data[i].title
        clone.querySelector("#news-image").src = data[i].img_url
        clone.querySelector(".news-card").id = data[i]._id
        document.getElementById("real-news-container").appendChild(clone)
    }
}

function get_news_data() {
    $.ajax(
        {
            "url": `/get_news_articles`,
            "type": "GET",
            "success": load_news_cards
        }
    )
}

function confirm_article_insertion(data) {
    console.log(data)
}

function confirm_days_update(data) {
    console.log(data)
}

function update_days_in_collection(days_difference) {
    $.ajax(
        {
            "url": `/updateDaysCollection`,
            "type": "POST",
            "success": confirm_days_update,
            "data": {
                "days_difference": days_difference
            }
        }
    )
}

function process_news_response(data) {
    for (i = 0; i < data.articles.length; i++) {
        console.log(data.articles[i])
        news_title = data.articles[i].title
        $.ajax(
            {
                "url": `/get_news_articles`,
                "type": "GET",
                "success": function(data) {
                     duplicates = data.filter(function(article) {
                         if (article.title == news_title) {
                            return article   
                         }
                     })
                     if (duplicates.length < 1) {
                        $.ajax(
                            {
                                "url": `/add_article`,
                                "type": "POST",
                                "data": {
                                    "title": data.articles[i].title,
                                    "url": data.articles[i].url,
                                    "img_url": data.articles[i].urlToImage,
                                    "description": data.articles[i].description,
                                    "content": data.articles[i].content
                                },
                                "success": confirm_article_insertion 
                            }
                        )
                     }
                }
            }
        )
    }
}

function get_daily_news() {
    year = date.getFullYear()
    month = date.getMonth()
    day = date.getDate()
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    $.ajax(
        {
            "url": `https://newsapi.org/v2/everything?q=covid&from=${year}-${month}-${day}&to=2022-05-10&sortBy=relevancy&searchIn=title&apiKey=739c4c9ed94b4c0a9075ff4924b682b3`,
            "type": "GET",
            "success": process_news_response,
        }
    )
}

function determine_daily_update(data) {
    console.log(data[0])
    current_days = Math.floor(date.getTime() / 86400000)
    console.log("exact days", date.getTime() / 86400000)
    console.log("Current total days", current_days)
    if (current_days > data[0].days_since_1970) {
        days_difference = current_days - data[0].days_since_1970
        get_daily_news()
        update_days_in_collection(days_difference)
    }else {
        console.log("24 hours have not passed yet")

    }
}

async function determine_new_day() {
    // how to determine if a day has passed 
    // store the current amount of days in db so it can always be referenced
    // send get request to retrieve the days back
    // do a call on the date.getTime and check if the just returned date is greater than the one in the db
    // check if the current days right now is greater than the ones in the db
    // if it is bigger send a put or post back to update the value with the new value
    // at the same time also send a get request to the news api to get back the covid news
    // else if the days was not greater than the one in the db, don't do anything
    milliseconds_per_day = 86400000
    current_time = date.getTime() / milliseconds_per_day
    $.ajax(
        {
            "url": `/day`,
            "type": "GET",
            "success": determine_daily_update
        }
    )

}

function setup() {
    determine_new_day()
    get_news_data()
    $("body").on("click", ".news-card", get_full_article_info)
    $("body").on("click", ".article-close", close_article)
}

$(document).ready(setup)