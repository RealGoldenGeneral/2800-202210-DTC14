const date = new Date()

function load_selected_article(data) {
    console.log(data)
}

function get_full_article_info() {
    headline = $(this).find("h5").text()
    $.ajax(
        {
            "url": "/find_article",
            "type": "GET",
            "data": {
                "title": headline
            },
            "success": load_selected_article
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

function get_daily_news() {
    $.ajax(
        {
            "url": `https://newsapi.org/v2/everything?q=covid&from=2022-05-10&to=2022-05-10&sortBy=relevancy&apiKey=739c4c9ed94b4c0a9075ff4924b682b3`,
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
}

$(document).ready(setup)