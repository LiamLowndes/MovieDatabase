const express = require('express');
const humans = require('human-names');
const coolImages = require("cool-images");
const fs = require("fs");
const session = require('express-session');
const { generateKeyPair } = require('crypto');

let router = express.Router();

//For POST /

router.get("/", getMovies, getReviews, loadPage);
router.get("/logout", logout);
router.post("/", getUsers, login);


function getUsers(req, res, next){
  fs.readFile("./public/db/users.json", function(err, users) {
    res.users = JSON.parse(users);
    next();
  });
}

function getPeople(req, res, next){
  fs.readFile("./public/db/people.json", function(err, people) {
    res.people = JSON.parse(people);

    var count = 0;

    res.people.forEach(person => {
      res.people[count].followedBy = [];
      count++;
    })

    next();
  });
}

function login(req, res, next){

	if(req.session.loggedin){
    console.log("Already logged in!")
		res.status(200).send("Already logged in!")
		return;
  }
  
	let username = req.body.username;
	let password = req.body.password;

  user = res.users.find(user => user.username === username);
  

  if(user != undefined){
    if(user.password === password){
      req.session.loggedin = true;

      delete user.password;
      req.session.user = user;
      

      res.status(200).send("Logged in!")
      console.log("Logged In!");
      console.log(req.session);
      
      
    }else{
      console.log("Login failed")
      res.status(401).send("Not authorized. Invalid password.");
    }
  }else{
    console.log("Login failed")
    res.status(401).send("Not authorized. Invalid username.");
    return;
  }
		
}

function logout(req, res, next) {
  req.session.loggedin = false;
  res.redirect("/");
  console.log(req.session);
  return;
}

function getMovies(req, res, next){

  fs.readFile("./public/db/movie-data.json", function(err, movies){
      
      if(err) {
          res.status(500).send("Error reading movies.");
          return;
      }
      res.movies = JSON.parse(movies);
      next();
  });

}

function getReviews(req, res, next){

  fs.readFile("./public/db/reviews.json", function(err, reviews){
      
      if(err) {
          res.status(500).send("Error reading reviews.");
          return;
      }
      res.reviews = JSON.parse(reviews);
      next();
  });

}

function loadPage(req, res, next) {

    if (!req.session.loggedin) {
      res.render("pages/index", {session: req.session, movies:undefined});
    } else {

      user = req.session.user;

      let movies = [];
      let genres = [];

      user.reviews.forEach(revID => {
        movies.push(res.reviews.find(review => review.id === revID).movie)
      })

      res.movies.forEach(movie => {
        if (movies.includes(movie.id)) {
          
          genres = genres.concat(movie.Genre.split(", "));
        }
      });

      genres = Array.from(new Set(genres));

      let rec = [];

      for (i=0;i<500;i++) {
        pos = res.movies[Math.floor(Math.random() * (res.movies.length-1))];
        let total = 0;

        

        genres.forEach(g => {
          if (pos.Genre.split(", ").includes(g)) {
            total += 1;
          }
        });

        user.peopleFollowed.forEach(person => {
          if ((pos.Actors.split(", ").includes(person)) || (pos.Writer.split(", ").includes(person)) || (pos.Director.split(", ").includes(person))) {
            total += 2;
          }
        });

        if (total > 3) {
          rec.push(pos)
        }

      }

      res.rec = rec;
      res.render("pages/index", {session: req.session, movies:res.rec});
    }

}

function signUp(req, res, next) {

    let user = req.params.uid;
    fileName = "users/" + JSON.parse(user).username + ".json"

    fs.appendFile(fileName, user, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
};

module.exports = router;


