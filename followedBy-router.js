const express = require('express');
const session = require('express-session');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);
router.get("/:uid", getUsers, getPeople, findPeople, respondPeople);

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

function findPeople(req, res, next){

    let toLook = res.users.find(user => user.username === req.params.uid);

    req.user = toLook;

    toLook = toLook.peopleFollowed;

    let found = [];

    toLook.forEach(personID => {
        let personFound = res.people.find(person => person.id === personID);
        found.push(personFound);
    });

    res.people = found;
    next();

}

function respondPeople(req, res, next){

    res.format({
        "text/html": function() {res.render("pages/followedBy", {people: res.people, session:req.session, user: req.user})},
        "application/json": function() {res.json(res.people)}
    })

}


module.exports = router;