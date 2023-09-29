const express = require('express');
const session = require('express-session');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);

router.get("/", queryParser, searchLoad, respondSearch)
router.get("/:uid", loadUser, loadReviews, respondUser)
router.post("/:uid/changeBio", express.json(), loadUser, changeBio)
router.post("/toggleCon", getUsers, toggleCon, updateUser);
router.post("/toggleFollow", getUsers, toggleFol, updateUser);

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

    res.users.some(u => {
        if (u.username === remPerson) {
            remID = u.id;
            remIndex = count;
            return true;
        }
        count++
    })

    res.users[userIndex].following.some(person => {
        if (remID === person) {
            rem = true;
            return true;
        }
    });

    followIndex = res.users[userIndex].following.indexOf(remID);
    followRemIndex = res.users[remIndex].followers.indexOf(res.users[userIndex].id);

    if (rem) {
        res.users[userIndex].following.splice(followIndex, 1);
        req.session.user.following = res.users[userIndex].following;

        res.users[remIndex].followers.splice(followRemIndex, 1);

    } else {
        res.users[userIndex].following.push(remID);
        req.session.user.following.push(remID);

        res.users[remIndex].followers.push(res.users[userIndex].id);

    }

    

    res.newUsers = res.users;
    next();


};

function toggleCon(req, res, next) {
    
    user = req.session.user

    var count = 0;

    res.users.some(u => {
        if (u.username === user.username) {
            userIndex = count;
            return true;
        }
        count++
    })

    res.users[userIndex].contributor = !res.users[userIndex].contributor;
    req.session.user.contributor = !req.session.user.contributor

    res.newUsers = res.users;
    next();
};

function updateUser(req, res, next) {
    
    
    temp = JSON.stringify(res.newUsers, null, 4)

    fs.writeFile("./public/db/users.json", temp, function (err,data) {
    
        if (err) {
            return console.log(err);
        }
    });

    res.status(201).send("Profile Updated");
}

function auth(req, res, next) {

	if(!req.session.loggedin){
		res.redirect("/");
		return;
	}
	next();
};

function queryParser(req, res, next){
    //max amount of users per page
    const MAX_USERS = 100;

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

    //finds out how many users to load on the page
    try {
        if (!req.query.limit) {
            req.query.limit = MAX_USERS;
        }

        req.query.limit = Number(req.query.limit);

        if (req.query.limit > MAX_USERS) {
            req.query.limit = MAX_USERS;
        }
    } catch {
        req.query.limit = MAX_USERS;
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

    res.users = [];
    res.lastPage = true;

    let count = 0;
    let startIndex = (req.query.page-1) * Number(req.query.limit);
    let endIndex = startIndex + Number(req.query.limit);

    

    fs.readFile("./public/db/users.json", function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }
        
        users = JSON.parse(users);
        
        users.some(user => {
            if (count >= endIndex) {
                res.lastPage = false;
                return true;
            }

            if (userMatch(user, req.query)) {

                if (count >= startIndex) {
                    res.users.push(user);
                    count++;
                } else {
                    count++;
                }
            }
        });
        next();
    });
}

//code taken from express lectrue 14 by David Mckenney
//Helper function for determining whether a product
// matches the query parameters. Compares the name,
// min price, and max price. All must be true.
//Again, different systems may have different logic

function userMatch(user, query){
	let nameCheck = query.name == "*" || user.username.toLowerCase().includes(query.name.toLowerCase());
	return nameCheck
}

function respondSearch(req, res, next) {

    if (req.qstring === undefined) {
        req.qstring = "";
    }

    nextL = "?" + "page=" + (req.query.page + 1) + "&" + req.qstring;
    prevL = "?" + "page=" + (req.query.page - 1) + "&" + req.qstring;

    res.format({
        "text/html": function() {res.render("pages/search", {m: false, u: true, p: false, users: res.users, page: req.query.page, nextLink: nextL, prevLink: prevL, lastPage: res.lastPage, session: req.session})},
        "application/json": function() {res.json(res.users)}
    })

    
}

function loadUser(req, res, next) {

    let userName = req.params.uid.toLowerCase();
    res.user = undefined;

    fs.readFile("./public/db/users.json" , function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }
        
        users = JSON.parse(users)

        users.some(user => {
            if (user.username.toLowerCase() === userName) {
                res.user = user;
                return true;
            }
        })

        if(res.user === undefined) {
            res.status(500).send("User not found");
            return;
        } else {
            next();
        }
    });

}

function loadReviews(req, res, next) {
    
    let reviewKeys = res.user.reviews;

    console.log(reviewKeys);

    res.reviews = [];

    fs.readFile("./public/db/reviews.json", function(err, reviews){
        
        if(err) {
            res.status(500).send("Error finding reviews");
            return;
        }

        reviews = JSON.parse(reviews);
        
        reviewKeys.forEach(key => {
            
            reviews.some(review => {

                if (review.id === key) {
                    res.reviews.push(review);
                    return true;
                }

            })

        });
        next();
    });
}

function respondUser(req, res, next) {
    
    req.session.mypage = false;
    let doesFollow = false;

    if (res.user.id === req.session.user.id) {
        req.session.mypage = true;
    }

    console.log(req.session.user.following);

    req.session.user.following.some(person => {
        if (person === res.user.id) {
            doesFollow = true;
            return true;
        }
    })

    res.format({
        "text/html": function() {res.render("pages/user", {user: res.user, reviews: res.reviews, session: req.session, doesFollow: doesFollow})},
        "application/json": function() {res.json(res.user)}
    });
}
//all my probelsm were because req and res were reversed
function changeBio(req, res, next) {
    
    let newUser = res.user;
    newUser.bio = req.body.bio;

    newUser = JSON.stringify(newUser, null, 4);

    console.log(newUser);

    /*fs.writeFile("./public/db/users/" + res.user.id + ".json", newUser, function (err,data) {
        
        if (err) {
          return console.log(err);
        }
        console.log(data);
      });
    
    res.status(200).send("update complete!")*/
    
}

module.exports = router;