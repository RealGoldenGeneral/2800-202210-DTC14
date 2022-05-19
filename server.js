// const mysql = require("mysql");
const express = require("express");
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

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

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img", express.static("./img"))

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
        id = full_info[0]._id
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

app.get("/leaderboard", function (req, res){
  res.sendFile(__dirname + "/leaderboard.html")
})

app.get("/news", function(req, res) {
  res.sendFile(__dirname + "/news.html")
})

app.get("/game", function (req, res){
  res.sendFile(__dirname + "/game.html")
})

app.get("/quiz", function (req, res){
  res.sendFile(__dirname + "/quiz.html")
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
      if (found_article.length > 1) {
        res.json(found_article[0])
      }
      else {
        res.json(found_article)
      }
    }
  })
})

app.listen(process.env.PORT || 5005, function (err) {
  if (err)
      console.log(err);
})

const mongoose = require('mongoose');
const { request } = require("express");

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    username: String,
    phone: String,
    img:String
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

const usersSchema = new mongoose.Schema({
  // _id: Object,
  name: String,
  email: String,
  username: String,
  phone: String,
  img:String
})

const scoresSchema = new mongoose.Schema({
  name: String,
  score: Number
})

const questionsSchema = new mongoose.Schema({
  name: String,
  score: Number
})

const userModel = mongoose.model("users", userSchema);
const dayModel = mongoose.model("days", daySchema);
const newsModel = mongoose.model("news", newsSchema);
const scoresModel = mongoose.model("scores", scoresSchema);
const questionsModel = mongoose.model("correct_questions", questionsSchema);

app.get('/profile', (req,res) =>{ 
    userModel.find({}, function(err,users)
     {
      res.render('profile', {
        name: users[16].name,
        email: users[16].email,
        username: users[16].username,
        phone: users[16].phone,

      })
    })
})

app.put('/insertRecord', (req, res) => {
  scoresModel.create({
    'names': full_info[0].username,
    'score': req.body.score
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log ("Data: " + data)
    }
    res.send("Successfully inserted record.")
  })
})

app.get('/getRecords', (req, res) => {
  scoresModel.find({}, function (err, scores) {
    if (err) {
      console.log("Error: " + error)
    } else {
      console.log("Data: " + scores)
    }
    res.send("Successfully displayed all scores.")
  })
})

app.put('/getQuizRecords', (req, res) => {
  scoresModel.find({}, function (err, scores) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + scores)
    }
    res.send("Successfully displayed all scores.")
  })
})

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
