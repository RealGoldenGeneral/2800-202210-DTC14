const express = require('express')
const app = express()
const mongoose = require("mongoose")
var session = require("express-session")

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
  UseNewURLParser: true, useUnifiedTopology:true});
const userSchema = new mongoose.Schema({
    _id: Object,
    name: String,
    email: String,
    username: String,
    phone: String
})


const cors = require('cors');
app.use(cors())

app.listen(5005, function (err) {
    if (err) console.log(err);
})

app.use(express.static("../public"));

app.post("/login", function (req, res) {
    console.log("recieved1")
    user_credential = {"username": req.body.name, "password": req.body.password}
    res.send(user_credential)
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
