const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"yourpasswd",
  database:"nodejs"
});

connection.connect(function(error){
  if(error) throw error
  else console.log("connected to the database successfully!")
})

app.get("/",function(req,res){
  res.sendFile(_dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
    if(results.length> 0){
      res.redirect("/welcome");
    } else {
      res.redirect("/");
    }
    res.end();
  })
})

app.get("/welcome",function(req,res){
  res.sendFile(__dirname + "/welcome.html")
})

app.listen(4500);