const date = new Date()

function closeArticle() {
    $("#full-news-article-card").remove()
    $(".news-card").show()
}

function loadSelectedArticle(data) {
    $("#real-news-container").css("grid-template-columns", "100%")
    console.log(data)
    $(".news-card").hide()
    fullArticleTemplate = document.getElementById("full-news-article")
    fullArticleTitle = data[0].title
    fullArticleImage = data[0].img_url
    fullArticleDesc = data[0].description
    fullArticleContent = data[0].content
    fullArticleLink = data[0].url
    var clone = fullArticleTemplate.content.cloneNode(true)
    clone.querySelector("#full-article-title").innerHTML = fullArticleTitle
    clone.querySelector("#full-article-image").src = fullArticleImage
    clone.querySelector("#full-article-desc").innerHTML = fullArticleDesc
    clone.querySelector("#full-article-content").innerHTML = fullArticleContent
    clone.querySelector("#full-article-link").href = fullArticleLink
    document.getElementById("real-news-container").appendChild(clone)
}

function getFullArticleInfo() {
    title = $(this).find("h5").text()
    console.log(title)
    $.ajax(
        {
            "url": `/find_article`,
            "type": "POST",
            "data": {
                "title": title
            },
            "success": loadSelectedArticle,
        }
    )
}

function loadNewsCards(data) {
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

function getNewsData() {
    $.ajax(
        {
            "url": `/get_news_articles`,
            "type": "GET",
            "success": loadNewsCards
        }
    )
}

function confirmArticleInsertion(data) {
    console.log(data)
}

function confirmDaysUpdate(data) {
    console.log(data)
}

function updateDaysCollection(daysDifference) {
    $.ajax(
        {
            "url": `/updateDaysCollection`,
            "type": "POST",
            "success": confirmDaysUpdate,
            "data": {
                "days_difference": daysDifference
            }
        }
    )
}

function processNewsResponse(data) {
    for (i = 0; i < data.articles.length; i++) {
        console.log(data.articles[i])
        newsTitle = data.articles[i].title
        $.ajax(
            {
                "url": `/get_news_articles`,
                "type": "GET",
                "success": function(data) {
                     duplicates = data.filter(function(article) {
                         if (article.title == newsTitle) {
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
                                "success": confirmArticleInsertion
                            }
                        )
                     }
                }
            }
        )
    }
}

function getDailyNews() {
    year = date.getFullYear()
    month = date.getMonth() + 1
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
            "success": processNewsResponse,
        }
    )
}

function determineDailyUpdate(data) {
    console.log(data[0])
    currentDays = Math.floor(date.getTime() / 86400000)
    console.log("exact days", date.getTime() / 86400000)
    console.log("Current total days", currentDays)
    if (currentDays > data[0].days_since_1970) {
        daysDifference = currentDays - data[0].days_since_1970
        getDailyNews()
        update_days_in_collection(daysDifference)
    }
    else {
        console.log("24 hours have not passed yet")
    }
}

async function determineNewDay() {
    // how to determine if a day has passed 
    // store the current amount of days in db so it can always be referenced
    // send get request to retrieve the days back
    // do a call on the date.getTime and check if the just returned date is greater than the one in the db
    // check if the current days right now is greater than the ones in the db
    // if it is bigger send a put or post back to update the value with the new value
    // at the same time also send a get request to the news api to get back the covid news
    // else if the days was not greater than the one in the db, don't do anything
    millisecondsPerDay = 86400000
    current_time = date.getTime() / millisecondsPerDay
    $.ajax(
        {
            "url": `/day`,
            "type": "GET",
            "success": determineDailyUpdate
        }
    )

}

function setup() {
    determineNewDay()
    getNewsData()
    $("body").on("click", ".news-card", getFullArticleInfo)
    $("body").on("click", ".article-close", closeArticle)
}

$(document).ready(setup)