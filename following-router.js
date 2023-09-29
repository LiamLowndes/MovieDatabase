const express = require('express');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);

router.get("/:uid", queryParser, searchLoad, respondFollowing)

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

        console.log("here");
        console.log(req.params.uid)

        toLook = users.find(user => user.username === req.params.uid).following;
        let found = [];

        toLook.forEach(userID => {
            let userFound = users.find(user => user.id === userID);
            found.push(userFound);
        });

        found.some(user => {
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
        console.log(toLook);
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

function respondFollowing(req, res, next) {

    if (req.qstring === undefined) {
        req.qstring = "";
    }

    nextL = "?" + "page=" + (req.query.page + 1) + "&" + req.qstring;
    prevL = "?" + "page=" + (req.query.page - 1) + "&" + req.qstring;

    res.format({
        "text/html": function() {res.render("pages/search", {m: false, u: true, p: false, users: res.users, page: req.query.page, nextLink: nextL, prevLink: prevL, lastPage: res.lastPage, session:req.session})},
        "application/json": function() {res.json(res.users)}
    })
    
    userID = req.uid
}

module.exports = router;