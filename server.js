const express = require('express')
const app = express()

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})

app.get('/', function (req, res) {
    res.send('GET request to homepage')
})

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html')
})

app.get('/thanks.html', function(req, res){
    res.sendFile(__dirname + '/thanks.html')
})

app.use('/css', express.static("./css"))
app.use('/img', express.static("./img"))