const express = require('express')
const app = express()

app.listen(5000, function(err){
    if(err) console.log(err);
})

//app.get('/', function (req, res) {
    //res.send('GET request to homepage')
//})

app.get('/game.html', function (req, res) {
    res.sendFile(__dirname + '/game.html')
})

app.use(express.static("css"));
app.use(express.static("js"));
app.use('/img', express.static("./img"))

