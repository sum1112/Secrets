//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

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


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]});
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
  const em = req.body.username;
  const pwd = req.body.password;
  const newUser = new User({
    email : em,
    password : pwd
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

app.route("/login")
.get(function (req, res) {
  res.render("login");
})
.post(function (req, res) {
  const em = req.body.username;
  const pwd = req.body.password;
  User.findOne({email : em}, function (err, result) {
    if (result && pwd == result.password) {
      console.log("Entered successfully");
      res.render("secrets");
    }
    if (result && pwd != result.password) {
      console.log("Enter correct password");
      res.render("login");
    }

    if (!result) {
      console.log("Please register first.")
      res.render("register");
    }
    if (err) {
      console.log(err);
    }
  });
});








app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
