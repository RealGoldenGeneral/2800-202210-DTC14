const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
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
async function createDB() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true
  })
  const createDBandTables = await connection.query(`CREATE DATABASE IF NOT EXISTS nodejs;
  use nodejs;
  CREATE TABLE IF NOT EXISTS user
  NameID int NOT NULL AUTO INCREMENT
  name varchar(30)
  password varchar(30)
  PRIMARY KEY (NameID)`)

  await connection.query(createDBandTables);

  const [user_rows, user_fields] = await connection.query("SELECT * FROM user");

  if (user_rows.length == 0) {
    let sqlQuery = "INSERT INTO user (name, password) values ?"
    let userRecord = [["Roy", "roypassword"]];
    await connection.query(sqlQuery, [userRecord]);
  }
}

app.listen(5005, function (err) {
  if (err) console.log(err);
  else createDB();
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
