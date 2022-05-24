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
  userModel.find({username: username}, function(err, user) {
    console.log(`entered: ${pass}, in db: ${user}`)
    var full_info = user
    console.log("Full Info: ", full_info)
    if (err) {
      console.log(err)
    }
    else {
      user = user.map(filter_password)
      console.log(user[0])
      if (req.body.password == user[0]) {
        id = full_info[0]._id
        req.session.real_user = full_info
        // console.log(req.session.real_user = full_info)
        console.log(full_info) 
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

app.post("/adminLogin", function (res, req) {
  console.log("request recieved")
  console.log(req.body.username, req.body.password)
  username = req.body.username
  password = req.body.password
  userModel.find({username: username}, function (err, user) {
    console.log(`entered ${password} into db: ${user}.`)
    var full_info = user
    console.log("full info: ", full_info)
    if (err) {
      console.log(err)
    } else {
      if (req.body.password == user[0]) {
        id = full_info[0]._id
        req.session.full_user = full_info
        console.log(full_info)
        if (full_info[0].type == "admin") {
          req.session.authenticated = true
          res.send(req.session.real_user)
        } else {
          req.session.authenticated = false
          res.send("access denied")
        }
      } else {
        req.session.authenticated = false
        res.send("incorrect information")
      }
    }
  })
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

app.get("/settings", function (req, res) {
  res.sendFile(__dirname + "/settings.html")
})

app.get("/gamePage", function (req, res) {
  res.sendFile(__dirname + "/gamePage.html")
})

app.get("/startQuiz/", function(req, res) {
  res.sendFile(__dirname + "/play-quiz.html")
})

app.get("/getUserInfo", function(req, res) {
  userModel.find({username: req.session.real_user[0].username}, function(err, data) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + data)
      res.json(data)
    }
  })
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

app.post("/find_article", function(req, res) {
  console.log("server recieved the get request")
  console.log("Passed title", req.params.title)
  newsModel.find({title: req.body.title}, function(err, found_article) {
    if (err) {
      console.log("Err" + err) 
    }
    else {
      console.log("Data" + found_article)
      if (found_article.length > 1) {
        res.json(found_article)
      }
      else {
        res.json(found_article)
      }
    }
  })
})

app.get("/getSelectedCategory", function(req, res) {
  userModel.find({username: req.session.real_user[0].username}, function(err, user_stuff) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + user_stuff)
      res.json(user_stuff)
    }
  })
})

app.post("/findQuizQuestions", function(req, res) {
  quizModel.find({category: req.body.category}, function(err, questions) {
    if (err) {
      console.log(err)
    }
    else {
      console.log("Data")
      res.send(questions)
    }
  })
})

app.get("/getQuizScores", function(req, res) {
  console.log("Current User: ", req.session.real_user)
  userModel.find({username: req.session.real_user[0].username}, function(err, user_doc) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + user_doc)
      res.json(user_doc)
    }
  })
})

app.post("/updateUserQuizScore", function(req, res) {
  console.log("user score: ", req.body)
  console.log("/updateUserQuizScore", req.session.real_user)
  userModel.updateOne({username: req.session.real_user[0].username, "quiz_scores.category": req.body.category}, {$set: {"quiz_scores.$.high_score": parseInt(req.body.score)}}, function(err, data) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + data)
      res.send("success")
    }
  })
})

app.listen(process.env.PORT || 5010, function (err) {
  if (err)
      console.log(err);
})

const mongoose = require('mongoose');
const { request } = require("express");
const { name } = require("ejs");
const { Router } = require("express");

mongoose.connect("mongodb+srv://A1exander-liU:assignment3@cluster0.xi03q.mongodb.net/co-vention?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({ 
    _id:Object,
    name: String,
    password: String,
    type: String,
    email: String,
    username: String,
    phone: String,
    img:String,
    category: String,
    quiz_scores: [{
      category: String,
      high_score: Number,
      _id: false}]
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

// const usersSchema = new mongoose.Schema({
//   // _id: Object,
//   name: String,
//   email: String,
//   username: String,
//   phone: String,
//   img:String,
// })

const scoresSchema = new mongoose.Schema({
  name: String,
  score: Number
})

const questionsSchema = new mongoose.Schema({
  name: String,
  score: Number
})

const quizSchema = new mongoose.Schema({
  category: String,
  questions: [{
    question: String,
    choices: [Object]
  }]
})

const userModel = mongoose.model("users", userSchema);
const dayModel = mongoose.model("days", daySchema);
const newsModel = mongoose.model("news", newsSchema);
const scoresModel = mongoose.model("scores", scoresSchema);
const questionsModel = mongoose.model("correct_questions", questionsSchema);
const quizModel = mongoose.model("quizzes", quizSchema)



app.get('/profile', (req,res) =>{ 
    userModel.find({name:req.session.real_user.name}, function(err,users)
     {
      res.render('profile', {
        name: req.session.real_user[0].name,
        email: req.session.real_user[0].email,
        username: req.session.real_user[0].username,
        phone: req.session.real_user[0].phone,
        img: req.session.real_user[0].img

      })
    })
})

app.post('/changeUsername', function (req, res) {
  userModel.updateOne({
    name: req.session.real_user[0].name
  }, {
    $set: {'username': req.body.username}
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
      res.send("Successfully updated.")
    }
  })
})

app.post('/changePassword', function (req, res) {
  userModel.updateOne({
    name: req.session.real_user[0].name
  }, {
    $set: {'password': req.body.password}
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
      res.send("Successfully updated.")
    }
  })
})

app.post('/changeEmail', function (req, res) {
  userModel.updateOne({
    name: req.session.real_user[0].name
  }, {
    $set: {'email': req.body.email}
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
      res.send("Successfully updated.")
    }
  })
})

app.post('/changePhoneNumber', function (req, res) {
  userModel.updateOne({
    name: req.session.real_user[0].name
  }, {
    $set: {'phone': req.body.phone}
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
      res.send("Successfully updated.")
    }
  })
})

app.post('/changeQuizCategory', function (req, res) {
  userModel.updateOne({
    'username': req.session.real_user[0].username
  }, {
    $set: {'category': req.body.category}
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
      res.send("Successfully updated.")
    }
  })
})

app.put('/insertRecord', (req, res) => {
  userModel.find({name: req.session.real_user[0].name}, function (err, users) {
    username = req.session.real_user[0].username
  })
  scoresModel.create({
    'name': username,
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

app.get('/signup', function (req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.put('/addNewUser', function (req, res) {
  userModel.create({
    '_id': Object,
    'name': req.body.name,
    'password': req.body.password,
    'type': 'user',
    'email': req.body.email,
    'username': req.body.username,
    'phone': req.body.phone,
    'img': './img/profileicon.png',
    'category': "covid_safety",
    'education': req.body.education,
    'quiz_scores': [{'category': 'covid_safety', 'high_score': 0}, {'category': 'covid_information', 'high_score': 0}]
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + data)
    }
    res.send("Data sent successfully.")
  })
})

app.get('/thanks', function (req, res) {
  res.sendFile(__dirname + "/thanks.html")
})

app.get('/getRecords', (req, res) => {
  scoresModel.find({}, function (err, scores) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + scores)
    }
    res.send(scores)
  })
})

app.get('/getQuizRecords', (req, res) => {
  userModel.find({}, function (err, scores) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + scores.quiz_scores)
    }
    res.send(scores)
  })
})

app.get('/getUsers', function (req, res) {
  userModel.find({type: "user"}, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
    res.send(data)
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
