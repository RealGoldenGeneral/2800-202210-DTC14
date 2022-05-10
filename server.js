const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

const cors = require('cors');
app.use(cors())

app.use(express.static("./public"));
app.use('/css', express.static("./css"))
app.use('/js', express.static("./js"))

function filter_password(data) {
  return data.password
}

app.post("/login", function(req, res) {
  console.log("post request recieved")
  console.log(req.body.name, req.body.password)
  username = req.body.name
  pass = req.body.password
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
})

app.get("/welcome",function(req,res){
  res.sendFile(__dirname + "/welcome.html")
})

app.get("/leaderboard", function (req, res){
  res.sendFile(__dirname + "/leaderboard.html")
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
