const date = new Date()


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

function get_daily_news() {
    $.ajax(
        {
            "url": `https://newsapi.org/v2/everything?q=covid&from=2022-05-10&to=2022-05-10&sortBy=popularity&apiKey=739c4c9ed94b4c0a9075ff4924b682b3`,
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
    // console.log(Math.floor(current_time))
    // await $.ajax(
    //     {
    //         "url": `https://newsapi.org/v2/everything?q=covid&from=2022-05-10&to=2022-05-10&sortBy=popularity&apiKey=739c4c9ed94b4c0a9075ff4924b682b3`,
    //         "type": "GET",
    //         "success": process_response
    //     }
    // )
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
    // $("#news-tab").click(determine_new_day)
}

$(document).ready(setup)