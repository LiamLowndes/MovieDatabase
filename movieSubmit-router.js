const express = require('express');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);
router.get("/", loadSubmit);

//read records finds currentLen which tells us which ID to attatch to the new movie

function auth(req, res, next) {

	if ((!req.session.loggedin) || (!req.session.user.contributor)) {
		res.redirect("/");
		return;
	}
	next();
};

function loadSubmit(req, res, next) {
    res.render("pages/movieSubmit", {session: req.session});
    res.status(200);
}

module.exports = router;

/*------------------------------------------------------------------------------

function readRecords(req, res, next) {

    fs.readFile("./public/db/movieData.json", function(err, data){
        
        if(err) {
            res.status(501).send("Error posting movie");
            return;
        }

        res.newObj = {"currentLen": JSON.parse(data).currentLen + 1};
        next();

    });
};

//updates the movieData.json file, increasing its currentLen value by 1.

function updateRecords(req, res, next) {

    fs.writeFile("./public/db/movies/movieData.json", JSON.stringify(res.newObj, null, 4), function (err,data) {

        if(err) {
            res.status(502).send("Error posting movie");
            return;
        }

        console.log(data);
        res.currentLen = res.newObj.currentLen;
        next();
    });

}

//creats a new movie file in the movies folder

function postSubmit(req, res, next) {

    newMovie = req.body;
    newMovie.id = res.currentLen;
    newMovie.review = [];

    
    fs.writeFileSync("./public/db/movies/" + res.currentLen + ".json", JSON.stringify(newMovie, null, 4), function (err,data) {
            
        if(err) {
            res.status(503).send("Error posting movie");
            return;
        }
        res.status(200).send("Movie has been added successfully")
    });
    
};
*/

