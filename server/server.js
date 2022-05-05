const express = require('express')
const app = express()

var session = require("express-session")

app.use(session({
    secret: "ssshhhhh",
    saveUninitialized: true,
    resave: true
}))

users = {
    "user1": "pass1",
    "user2": "pass2"
}

app.listen(5005, function (err) {
    if (err) console.log(err);
})

// app.use(express.static("/index.html"));

app.get("/login", function (req, res) {
    res.sendFile(_dirname + "../index.html")
})

// app.get('/', function (req, res) {
//     if (req.session.authenticated) {
//         res.send(`Hi ${req.session.user}`)
//     } else {
//         res.redirect('/login')
//     }
// })

// app.get("/login", function (req, res, next) {
//     res.send("Plesae provide the credentials through the URL")
// })

// app.get(`/login/:user/:pass`, function (req, res, next) {
//     if (users[req.params.user] == req.params.pass) {
//         req.session.authenticated = true
//         req.sesssion.user = req.params.user
//         res.send("Successful login!")
//     } else {
//         req.session.authenticated = false
//         res.send("Failed login")
//     }
// })