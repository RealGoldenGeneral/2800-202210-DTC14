const express = require('express')
const app = express()


app.listen(3000, function(err){
    if(err) console.log(err);
})

app.get('/', function (req, res){
    res.send('GET request to homepage')
})

app.get('/game', function (req, res){
    res.send('GET request to game')
})

app.get('/quizzes', function (req, res){
    res.send('GET request to quizzes')
})

app.get('/profile', function (req, res){
    res.send('GET request to profile')
})

app.get('/completion', function (req, res){
    res.send('GET request to completion')
})