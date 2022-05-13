// const mysql = require("mysql");
const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

var session = require('express-session')

// To use the session middleware
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

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
app.use(express.static("img"))

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
    }
    else {
      user = user.map(filter_password)
      console.log(user[0])
      if (req.body.password == user[0]) {
        req.session.real_user = full_info
        req.session.authenticated = true
        res.send(req.session.real_user)
      }
      else {
        req.session.authenticated = false
        res.send("incorrect information")
      }
    }
  })
  // res.send({"stuff": username, "stuff2": pass})
})

app.get("/signOut", function(req, res) {
  req.session.authenticated = false
  res.send("Signed out successfully!")
})

app.get("/welcome", function(req, res) {
  if (req.session.authenticated) {
    res.sendFile(__dirname + "/welcome.html")
  }
  else {
    res.redirect("/")
  }
})

app.get("/news", function(req, res) {
  res.sendFile(__dirname + "/news.html")
})

app.get("/day", function(req, res) {
  console.log("request recieved to get the days")
  dayModel.find({}, function(err, total_days) {
    if (err) {
      console.log("Err" + err)
    }
    else {
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
    }
    else {
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
    }
    else {
      console.log("Data" + article)
      res.send("successfully added articles in collection")
    }
  })
})

app.get("/get_news_articles", function(req, res) {
  newsModel.find({}, function(err, news) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + news)
      res.json(news)
    }
  })
})

app.get("/find_article/:title", function(req, res) {
  console.log("server recieved the get request")
  console.log("Passed title", req.params.title)
  newsModel.find({title: req.params.title}, function(err, found_article) {
    if (err) {
      console.log("Err" + err) 
    }
    else {
      console.log("Data" + found_article)
      res.json(found_article)
      }
  })
})

app.listen(process.env.PORT || 5005, function (err) {
  if (err)
      console.log(err);
})

const mongoose = require('mongoose');
// const { stringify } = require("nodemon/lib/utils");

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
});

const daySchema = new mongoose.Schema({
    days_since_1970: Number,
});

const newsSchema = new mongoose.Schema({
  title: {type: String, unique: true},
  url: String,
  img_url: String,
  description: String,
  content: String
});

const userModel = mongoose.model("users", userSchema);
const dayModel = mongoose.model("days", daySchema);
const newsModel = mongoose.model("news", newsSchema);
