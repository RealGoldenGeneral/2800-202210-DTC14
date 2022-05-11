// const mysql = require("mysql");
const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

const cors = require('cors');
app.use(cors())

// const cors = require('cors');
// app.use(cors())

// const connection = mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"yourpasswd",
//   database:"nodejs"
// });

// connection.connect(function(error){
//   if(error) throw error
//   else console.log("connected to the database successfully!")
// })

app.use(express.static("css"));
app.use(express.static("js"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

function filter_password(data) {
  return data.password
}

app.post("/login", function(req, res) {
  console.log("post request recieved")
  console.log(req.body.name, req.body.password)
  username = req.body.name
  pass = req.body.password
  // const user = new userModel({
  //   name: req.body.name,
  //   password: req.body.password
  // })
  // user.save(function(err, user) {
  //   if (err) {
  //     console.log(err)
  //   }else {
  //     console.log("welcome back", user.name)
  //     console.log(user)
  //   }
  // })
  userModel.find({name: username}, function(err, user) {
    console.log(`entered: ${pass}, in db: ${user}`)
    var full_info = user
    if (err) {
      console.log(err)
    }else {
      user = user.map(filter_password)
      console.log(user[0])
      if (req.body.password == user[0]) {
        res.send(full_info)
      }else {
        res.send("incorrect information")
      }
    }
  })
  // res.send({"stuff": username, "stuff2": pass})
})

app.get("/welcome", function(req, res) {
  res.sendFile(__dirname + "/welcome.html")
})

app.get("/news", function(req, res) {
  res.sendFile(__dirname + "/news.html")
})

app.get("/day", function(req, res) {
  console.log("request recieved to get the days")
  dayModel.find({}, function(err, total_days) {
    if (err) {
      console.log("Err" + err)
    }else {
      console.log("Data" + total_days)
      res.json(total_days)
    }
  })
})

app.post("/updateDaysCollection", function(req, res) {
  console.log(req.body.days_difference)
  dayModel.updateOne({}, {$inc: {days_since_1970: req.body.days_difference}}, function(err, update) {
    if (err) {
      console.log("Err" + err)
    }else {
      console.log("Data" + update)
      res.send("successful update")
    }
  })
})

app.post("/add_article", function(req, res) {
  console.log(req.body)
  var article = new newsModel({
    title: req.body.title,
    url: req.body.url,
    img_url: req.body.img_url,
    description: req.body.description,
    content: req.body.content
  })
  article.save(function(err, article) {
    if (err) {
      console.log("Err" + err)
    }else {
      console.log("Data" + article)
      res.send("successfully added articles in collection")
    }
  })
})

app.listen(5005, function (err) {
  if (err) console.log(err);
})

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
});
const userModel = mongoose.model("users", userSchema);

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const daySchema = new mongoose.Schema({
    days_since_1970: Number,
});
const dayModel = mongoose.model("days", daySchema);

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const newsSchema = new mongoose.Schema({
    title: String,
    url: String,
    img_url: String,
    description: String,
    content: String
});
const newsModel = mongoose.model("news", newsSchema);

//var session = require("express-session")

//const bodyparser = require("body-parser");
// app.use(bodyparser.urlencoded({
//   extended: true
// }));

// const cors = require('cors');
// app.use(cors())

// app.use(express.static("../public"));

// app.post("/login", function (req, res) {
//     console.log("recieved1")
//     user_credential = {"username": req.body.name, "password": req.body.password}
//     res.send(user_credential)
// })

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
