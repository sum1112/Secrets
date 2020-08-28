//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended : true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});



const User = new mongoose.model("User", userSchema);

app.route("/")
.get(function (req, res) {
  res.render("home");
});

app.route("/register")
.get(function (req, res) {
  res.render("register");
})
.post(function (req, res) {


  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email : req.body.username,
      password : hash
    });
    newUser.save(function (err) {
      if (!err) {
        console.log("User registered successfully.");
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.route("/login")
.get(function (req, res) {
  res.render("login");
})
.post(function (req, res) {
  const em = req.body.username;
  const pwd = req.body.password;
  User.findOne({email : em}, function (err, result) {
    if (result) {
      bcrypt.compare(pwd, result.password, function (err, resu) {
        if (resu) {
          res.render("secrets");
        }
        if (!resu) {
          console.log("Enter correct password.");
        }
        if (err) {
          console.log(err);
        }
      });
    }
    if (!result) {
      console.log("User not registered");
    }

  });
});








app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
