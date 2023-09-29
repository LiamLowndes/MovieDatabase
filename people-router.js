const express = require('express');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);

router.get("/", queryParser, searchLoad, respondSearch);
router.get("/:pid", loadPeople, loadMovies, respondPeople);
router.post("/toggleFollow", getUsers, getPeople, toggleFol, updateUser, updatePeople);

function getUsers(req,res, next) {

    fs.readFile("./public/db/users.json", function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }

        res.users = JSON.parse(users);
        next();

    });
};

function getPeople(req,res, next) {

    fs.readFile("./public/db/people.json", function(err, people){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }

        res.people = JSON.parse(people);
        next();

    });
};

function toggleFol(req, res, next) {

    user = req.session.user;

    var remID = -1;
    var userIndex = 0;

    var count = 0;

    res.users.some(u => {
        if (u.username === user.username) {
            userIndex = count;
            return true;
        }
        count++
    })

    count = 0;
    let remPerson = req.body.removeThisPerson;
    let rem = false;

    res.people.some(p => {
        if (p.name === remPerson) {
            remID = p.id;
            remIndex = count;
            return true;
        }
        count++
    })

    res.users[userIndex].peopleFollowed.some(person => {
        if (remID === person) {
            rem = true;
            return true;
        }
    });

    followIndex = res.users[userIndex].peopleFollowed.indexOf(remID);
    followRemIndex = res.people[remIndex].followedBy.indexOf(res.users[userIndex].id);

    if (rem) {
        res.users[userIndex].peopleFollowed.splice(followIndex, 1);
        req.session.user.peopleFollowed = res.users[userIndex].peopleFollowed;

        res.people[remIndex].followedBy.splice(followRemIndex, 1);

    } else {
        res.users[userIndex].peopleFollowed.push(remID);
        req.session.user.peopleFollowed.push(remID);

        res.people[remIndex].followedBy.push(res.users[userIndex].id);

    }

    res.remId = remID;
    res.newUsers = res.users;
    res.newPeople = res.people;
    next();


};

function updateUser(req, res, next) {
    
    temp = JSON.stringify(res.newUsers, null, 4)

    fs.writeFile("./public/db/users.json", temp, function (err,data) {
    
        if (err) {
            return console.log(err);
        }
    });

    next();
}

function updatePeople(req, res, next) {
    
    temp = JSON.stringify(res.newPeople, null, 4)

    fs.writeFile("./public/db/people.json", temp, function (err,data) {
    
        if (err) {
            return console.log(err);
        }
    });

    res.status(201).send("Update success!");
}

function auth(req, res, next) {

	if(!req.session.loggedin){
		res.redirect("/");
		return;
	}
	next();
};

function queryParser(req, res, next){
    
    //max amount of movies per page
    const MAX_PEOPLE = 100;

    //builds a query string for pagination
    //code taken from express lectrue 14 by David Mckenney
    let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
    req.qstring = params.join("&");

    //finds out how many people to load on the page
    try {
        if (!req.query.limit) {
            req.query.limit = MAX_PEOPLE;
        }

        req.query.limit = Number(req.query.limit);

        if (req.query.limit > MAX_PEOPLE) {
            req.query.limit = MAX_PEOPLE;
        }
    } catch {
        req.query.limit = MAX_PEOPLE;
    }

    //Parse page parameter
    //code taken from express lectrue 14 by David Mckenney
	try{
		if(!req.query.page){
			req.query.page = 1;
		}
		
		req.query.page = Number(req.query.page);
		
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}
    
    if(!req.query.name){
		req.query.name = "*";
	}
    next();   
}

function searchLoad(req, res, next){

    res.people = [];
    res.lastPage = true;

    let count = 0;
    let startIndex = (req.query.page-1) * Number(req.query.limit);
    let endIndex = startIndex + Number(req.query.limit);


    fs.readFile("./public/db/people.json", function(err, people){
        
        if(err) {
            res.status(500).send("Error reading people.");
            return;
        }
        
        people = JSON.parse(people);
        
        people.some(person => {

            if (count >= endIndex) {
                res.lastPage = false;
                return true;
            }

            if (peopleMatch(person, req.query)) {

                if (count >= startIndex) {
                    res.people.push(person);
                    count++;
                } else {
                    count++;
                }
            }
        })
        next();
    });

}


//code taken from express lectrue 14 by David Mckenney
//Helper function for determining whether a product
// matches the query parameters. Compares the name,
// min price, and max price. All must be true.
//Again, different systems may have different logic

function peopleMatch(people, query){
	let nameCheck = query.name == "*" || people.name.toLowerCase().includes(query.name.toLowerCase());
	return nameCheck
}

function respondSearch(req, res, next) {

    if (req.qstring === undefined) {
        req.qstring = "";
    }

    nextL = "?" + "page=" + (req.query.page + 1) + "&" + req.qstring;
    prevL = "?" + "page=" + (req.query.page - 1) + "&" + req.qstring;
    
    res.format ({

        "text/html": function() {res.render("pages/search", {m: false, u: false, p: true, people: res.people, page: req.query.page, nextLink: nextL, prevLink: prevL, lastPage: res.lastPage, session:req.session})},
        "application/json": function() {res.json(res.people)}
    });
    
}

function loadPeople(req, res, next) {

    name = req.params.pid.toLowerCase();

    fs.readFile("./public/db/people.json", function(err, people){

        if(err) {
            res.status(500).send("This person is not in the database.");
            return;
        }

        people = JSON.parse(people);
        notFound = true;

        people.some(person => {

            if (person.name.toLowerCase() === name) {
                notFound = false;
                res.person = person;
                return true;
            }

        })

        if (notFound) {
            res.status(500).send("This person is not in the database.");
            return;
        } else {
            res.people = people;
            next();
        }

    });
}

function loadMovies(req, res, next) {
        
    
    fs.readFile("./public/db/movie-data.json", function(err, movies){

        if(err) {
            res.status(500).send("Problem loading movies.");
            return;
        }

        res.movies = JSON.parse(movies);
        next();
    });

}

function respondPeople(req, res, next)  {

    let result = []
    let notFound = true;
    let doesFollow = false;

    res.person.movie.forEach(movie => {
        console.log(res.person); //check to see if data got changed to null
        res.movies.some(film => {
            if (movie === film.id) {
                result.push(film);
                notFound = false;
                return true;
            }
        });
    })
    
    res.movies = result;
    console.log(res.movies);
    
    
    req.session.user.peopleFollowed.some(person => {
        if (person === res.person.id) {
            doesFollow = true;
            return true;
        }
    });
        
            
    res.format ({
        
        "text/html": function() {res.render("pages/people", {person: res.person, movies: res.movies, session:req.session, doesFollow:doesFollow})},
        "application/json":function() {res.json(res.person)}

    });
    

}

module.exports = router;