const express = require('express');
const session = require('express-session');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);
router.get("/", getUsers, getPeople, getMovies, respondNotifs);

function auth(req, res, next) {

	if(!req.session.loggedin){
		res.redirect("/");
		return;
	}
	next();
};

function getPeople(req, res, next){

    fs.readFile("./public/db/people.json", function(err, people){
        
        if(err) {
            res.status(500).send("Error reading people.");
            return;
        }
        res.people = JSON.parse(people);
        next();
    });

}

function getUsers(req, res, next){

    fs.readFile("./public/db/users.json", function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }
        res.users = JSON.parse(users);
        next();
    });

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

function respondNotifs(req, res, next) {

    req.session.nonZero = false;

    if (req.session.user.notifications.length > 0) {
        req.session.nonZero = true;
    }

    res.render("pages/notifications", {session: req.session});





    /*var count = 0;

    res.users.forEach(user => {
        res.users[count].notifications = [];
        count++;
    });

    temp = JSON.stringify(res.users, null, 4);

    fs.writeFile("./public/db/users.json", temp, function (err,data) {
      
        if (err) {
          return console.log(err);
        }
        res.status(200).send("All good!")
      });

    res.render("pages/notifications", {session: req.session})*/

}

module.exports = router;