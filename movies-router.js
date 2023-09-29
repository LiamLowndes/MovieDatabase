const { count } = require('console');
const express = require('express');
const fs = require("fs");
let router = express.Router();

router.use("/", auth);

router.post("/", getMovies, getPeople, postMovie, newPeople, updatePeople);
router.get("/", queryParser, searchLoad, respondSearch);
router.get("/:mid", loadMovie, loadReviews, loadUser, loadSuggestions, respondMovie);
router.post("/reviews", getMovies, getReviews, updateReviews, updateMovies, getUsers, updateNotifsRev);


function getReviews(req, res, next) {
    
    fs.readFile("./public/db/reviews.json", function(err, reviews){
        
        if(err) {
            res.status(500).send("Error reading reviews.");
            return;
        }
        
        res.reviews = JSON.parse(reviews);
        next();

    });
}

function getUsers(req, res, next) {

    fs.readFile("./public/db/users.json", function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }
        
        res.users = JSON.parse(users);
        next();

    });
    
}

function updateNotifsMov(req, res, next) {

    allPeople = [];
    allPeople.concat(res.newMovie.Actors.split(", "));
    allPeople.concat(res.newMovie.Writer.split(", "));
    allPeople.concat(res.newMovie.Director.split(", "));

    allPeople = Array.from(new Set(allPeople));

    

    res.allPeople.forEach(person => {


        foundPerson = res.people.find(p => {p.name === person});
        var count = 0;

        res.users.forEach(user => {

            console.log()

            if (user.peopleFollowed.includes(foundPerson.id)) {
                res.users[count].notifications.unshift(["new movie", foundPerson.name, res.newMovie.Title, res.newMovie.id]);
            }

            count++;

        });
    });

    temp = JSON.stringify(res.users, null, 4);

    fs.writeFile("./public/db/users.json", temp, function (err,data) {
      
        if (err) {
          return console.log(err);
        }
        res.status(200).send("All good!")
      });

}

function updateNotifsRev(req, res, next) {

    var count = 0;
    res.users.forEach(user => {
        if (user.id === req.session.user.id) {
            res.users[count].reviews.push(res.newMovie.id);
        }
    });

    req.session.user.followers.forEach(follower => {

        let userIndex = res.users.find(user => user.usernmae === req.session.user.usernmae)
            
        res.users[userIndex].notifications.unshift(["review", req.session.user.username, res.foundMovie.id, res.foundMovie.Title]);


    })

    temp = JSON.stringify(res.users, null, 4);

    fs.writeFile("./public/db/users.json", temp, function (err,data) {
      
        if (err) {
          return console.log(err);
        }
        res.status(200).send("All good!")
      });

}

function updateReviews(req, res, next) {

    res.foundMovie = res.movies.find(movie => movie.Title === req.body.movieName);
    res.nextReviewID = res.reviews[res.reviews.length - 1].id + 1;

    let newReview = {};

    newReview.id = res.nextReviewID;
    newReview.user = req.session.user.username;
    newReview.summary = req.body.summary;
    newReview.review = req.body.theReview;
    newReview.score = req.body.score;
    newReview.movie = res.foundMovie.id;

    res.reviews.push(newReview);

    res.reviews = JSON.stringify(res.reviews, null, 4);

    fs.writeFile("./public/db/reviews.json", res.reviews, function (err,data) {
      
        if (err) {
          return console.log(err);
        }
        next();
      });

}

function updateMovies(req, res, next) {

    res.foundMovie.reviews.push(res.nextReviewID);

    res.movies[res.movies.indexOf(res.foundMovie)] = res.foundMovie;

    res.movies = JSON.stringify(res.movies, null, 4);

    fs.writeFile("./public/db/movie-data.json", res.movies, function (err,data) {
      
        if (err) {
          return console.log(err);
        }
        next();
      });


}

function auth(req, res, next) {
    
	if(!req.session.loggedin){

        res.format({

            "text/html": function() {res.redirect("/")},
            "application/json": function() {res.status(401).send("You are not authorized to perform this action.")}
    
        });

		return;
	}
	next();
};

function getMovies(req, res, next) {

    fs.readFile("./public/db/movie-data.json", function(err, movies){
        
        if(err) {
            res.status(500).send("Error reading movies.");
            return;
        }
        
        res.movies = JSON.parse(movies);
        next();

    });
    
}

function getPeople(req, res, next) {

    fs.readFile("./public/db/people.json", function(err, people){
        
        if(err) {
            res.status(500).send("Error reading people.");
            return;
        }
        
        res.people = JSON.parse(people);
        next();

    });
    
}

function postMovie(req, res, next) {
    newMovie = req.body;
    newMovie.reviews = [];
    newMovie.id = res.movies.length;
    notDup = true;

    res.movies.some(movie => {
        if (newMovie.Title === movie.Title) {
            notDup = false;
            return true;
        }
    });

    update = res.movies;
    update.push(newMovie);
    res.newMovie = newMovie;
    update = JSON.stringify(update, null, 4);

    if (notDup) {

        fs.writeFile("./public/db/movie-data.json", update, function (err,data) {
      
            if (err) {
              return console.log(err);
            }
          });

        console.log("movie added");
        next();

    } else {
        res.status(200).send("This movie is already in the database");
    }
}

function newPeople(req, res, next) {

    let newPeople = [];
    let actors = [];
    let writers = []; 
    let director = []; 
    res.oldPeople = [];

    actors = newMovie.Actors.split(", ");
    writers = newMovie.Writer.split(", ");
    director = newMovie.Director.split(", ");

    newPeople = newPeople.concat(actors);
    newPeople = newPeople.concat(writers);
    newPeople = newPeople.concat(director);

    newPeople = Array.from(new Set(newPeople));

    let toAdd = [];
    let found = undefined;
    let alreadAdded = undefined;

    actors.forEach(person => {

        found = res.people.find(p => p.name.toLowerCase() === person.toLowerCase());
        if (found === undefined) {
            alreadAdded = toAdd.find(p => p[0].toLowerCase() === person.toLowerCase());

            if ((alreadAdded === undefined) && (person.length > 0)) {
                temp = [person.toLowerCase(), ["Actor"]];
                toAdd.push(temp);
            } else if (person.length > 0) {
                toAdd[toAdd.indexOf(alreadAdded)][1].push("Actor");
            }
        } else {
            res.oldPeople.push(person);
        }
    });

    writers.forEach(person => {

        found = res.people.find(p => p.name.toLowerCase() === person.toLowerCase());
        if (found === undefined) {
            alreadAdded = toAdd.find(p => p[0].toLowerCase() === person.toLowerCase());

            if ((alreadAdded === undefined) && (person.length > 0)) {
                temp = [person.toLowerCase(), ["Writer"]];
                toAdd.push(temp);
            } else if (person.length > 0) {
                toAdd[toAdd.indexOf(alreadAdded)][1].push("Writer");
            }
        } else {
            res.oldPeople.push(person);
        }
    });

    director.forEach(person => {

        found = res.people.find(p => p.name.toLowerCase() === person.toLowerCase());
        if (found === undefined) {
            alreadAdded = toAdd.find(p => p[0].toLowerCase() === person.toLowerCase());

            if ((alreadAdded === undefined) && (person.length > 0)) {
                temp = [person.toLowerCase(), ["Director"]];
                toAdd.push(temp);
            } else if (person.length > 0) {
                toAdd[toAdd.indexOf(alreadAdded)][1].push("Director");
            }
        } else {
            res.oldPeople.push(person);
        }
    });
    


    var count = 0;
    let result = res.people;

    res.oldPeople = Array.from(new Set(res.oldPeople));
    res.status(404);
    
    res.oldPeople.forEach(old => {



            found = result.find(person => person.name === old)
            oldIndex = result.indexOf(found);
            console.log(res.newMovie.id)

            if (result[oldIndex].movie !== undefined) {
                result[oldIndex].movie.push(res.newMovie.id);
        }
    });

    toAdd.forEach(person => {
        
        let newPerson = {};
        let newName = [];
        
        newPerson.jobs = person[1];
        newPerson.collab = [];

        name = person[0].split(" ");
        name.forEach(part => {
            let newPart = part[0].toUpperCase() + part.slice(1);
            newName.push(newPart);
        });
        
        newName = newName.join(" ");
        newPerson.name = newName;
        newPerson.id = res.people.length + count;
        count++;
        newPerson.movie = [newMovie.id];
        newPerson.picture = "https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png";

        result.push(newPerson);

    });

    res.updatedPeople = result;

    update = JSON.stringify(result, null, 4);
  
    fs.writeFile("./public/db/people.json", update, function (err,data) {
        
        if (err) {
            return console.log(err);
        }

        console.log("People being processed.");
        next();

    });

}

function updatePeople(req, res, next) {

    update = []
  
    res.updatedPeople.forEach(person => {
  
      allPeeps = [];
      topPeeps = [];
      movies = [];
  
      movieSearch = person.movie;
  
      movieSearch.forEach(movieID => {
  
        movies.push(res.movies.find(movie => movie.id === movieID));
  
      });

      movies.forEach(movie => {
        
        if(movie !== undefined) {

            actors = movie.Actors.split(", ");
            writers = movie.Writer.split(", ");
            directors = movie.Director.split(", ");

            allPeeps = allPeeps.concat(actors);
            allPeeps = allPeeps.concat(writers);
            allPeeps = allPeeps.concat(directors);
        }
  
      });
  
      unPeeps = Array.from(new Set(allPeeps))
      scorePeeps = []
      var count = 0;
  
      unPeeps.forEach(peep => {
        let newPeep = [0, peep];
        scorePeeps.push(newPeep);
      })
  
      allPeeps.forEach(peep => {
  
        peepIndex = unPeeps.indexOf(peep);
        scorePeeps[peepIndex][0] = scorePeeps[peepIndex][0] + 1;

      })

      scorePeeps = scorePeeps.sort(sortFunction).reverse();
      
      scorePeeps.shift();

      if (scorePeeps.length > 5) {
        scorePeeps = scorePeeps.slice(0, 5);
      }

      scorePeeps.forEach(peep => {
        topPeeps.push(scorePeeps[count][1]);
        count++;
      });
  
      let newPerson = person;
      newPerson.collab = topPeeps;
      update.push(newPerson);
      
  
    });
  
    update = JSON.stringify(update, null, 4);
  
    fs.writeFile("./public/db/people.json", update, function (err,data) {
        
      if (err) {
        return console.log(err);
      }
    });
  
    res.status(200).send("all done");
  
  };

//sortFunction taken from: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
  }

function queryParser(req, res, next){
    //max amount of movies per page
    const MAX_MOVIES = 100;

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

    //finds out how many movies to load on the page
    try {
        if (!req.query.limit) {
            req.query.limit = MAX_MOVIES;
        }

        req.query.limit = Number(req.query.limit);

        if (req.query.limit > MAX_MOVIES) {
            req.query.limit = MAX_MOVIES;
        }
    } catch {
        req.query.limit = MAX_MOVIES;
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

    if(req.query.minrating){
		try{
			req.query.minrating = Number(req.query.minrating);
		}catch(err){
			req.query.minyear = undefined;
		}
    }
    
    if(req.query.genre){
		try{
			req.query.genre = String(req.query.genre);
		}catch(err){
			req.query.genre = undefined;
		}
    }

    if(req.query.year){
		try{
			req.query.year = Number(req.query.year);
		}catch(err){
			req.query.year = undefined;
		}
    }
    
    if(!req.query.title){
		req.query.title = "*";
    }

    if(!req.query.genre){
		req.query.genre = "*";
    }

    console.log("query complete")
    next();   
}

function searchLoad(req, res, next){

    res.movies = [];
    res.lastPage = true;
    
    let count = 0;
    let startIndex = (req.query.page-1) * Number(req.query.limit);
    let endIndex = startIndex + Number(req.query.limit);

    

    fs.readFile("./public/db/movie-data.json", function(err, movies){
        
        if(err) {
            res.status(500).send("Error reading movies.");
            return;
        }

        movies = JSON.parse(movies);
        
        movies.some(movie => {

            if (count >= endIndex) {
                res.lastPage = false;
                return true;
            }

            if (movieMatch(movie, req.query)) {

                if (count >= startIndex) {
                    res.movies.push(movie);
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

function movieMatch(movie, query){

    if (movie.Title === undefined) {
        return false;
    }

    let titleCheck = query.title == "*" || movie.Title.toLowerCase().includes(query.title.toLowerCase());
	let minratingCheck = (!query.minrating) || movie.imdbRating >= query.minrating;
    let yearCheck = (!query.year) || movie.Year == query.year;
    let genreCheck = query.genre == "*" || movie.Genre.toLowerCase().includes(query.genre.toLowerCase());
    
    return titleCheck && yearCheck && minratingCheck && genreCheck;
}

function respondSearch(req, res, next) {

    if (req.qstring === undefined) {
        req.qstring = "";
    }

    nextL = "?" + "page=" + (req.query.page + 1) + "&" + req.qstring;
    prevL = "?" + "page=" + (req.query.page - 1) + "&" + req.qstring;

    res.format({

        "text/html": function() {res.render("pages/search", {m: true, u: false, p: false, movies: res.movies, page: req.query.page, nextLink: nextL, prevLink: prevL, lastPage: res.lastPage, session : req.session})},
        "application/json": function() {res.json(res.movies)}

    });
}


function loadMovie(req, res, next) {

    let movieID = Number(req.params.mid);
    let notFound = true;

    fs.readFile("./public/db/movie-data.json", function(err, movies){
        
        if(err) {
            res.status(500).send("Error reading movie.");
            return;
        }

        movies = JSON.parse(movies);
        res.allMovies = movies;

        movies.some(movie => {

            if (movie.id === movieID) {
                res.movie = movie;
                notFound = false;
                return true;
            }

        });
        if (notFound) {
            res.status(500).send("Movie not found.");
            return;
        } else {
            next();
        }
    });
}

function loadReviews(req, res, next) {

    res.reviews = []

    console.log("here")

    fs.readFile("./public/db/reviews.json", function(err, reviews){
        
        if(err) {
            res.status(500).send("Error reading reviews.");
            return;
        }

        reviews = JSON.parse(reviews);
        
        res.movie.reviews.forEach(reviewID => {

            reviews.some(review => {

                

                if (review.id === reviewID) {
                    res.reviews.push(review);
                }

            });

        });
        
        next();

    });
}

function loadUser(req, res, next) {

     newRev = [];

    fs.readFile("./public/db/users.json", function(err, users){
        
        if(err) {
            res.status(500).send("Error reading users.");
            return;
        }

        users = JSON.parse(users);
        
        res.reviews.forEach(review => {

            newRev = review;

            users.some(user => {
                if (user.username === review.user) {
                    newRev.picture = user.picture;
                    return true;
                }
            });

        });
        next();
        
    });

}

function loadSuggestions(req, res, next) {

    genreList = res.movie.Genre.split(", ");
    actorList = res.movie.Actors.split(", ");

    res.sug = [];

    res.allMovies.some(movie => {

        movieGenreList = movie.Genre.split(", ");
        movieActorList = movie.Actors.split(", ");

        genreCheck = false;
        actorCheck = false;


        if (res.sug.length === 4) {
            return true;
        }
        if (movie.Title !== res.movie.Title) {
            
            let findGenre = undefined;
            let findActor = undefined;

            genreList.some(genre => {
                findGenre = movieGenreList.find(g => g === genre);
                if (findGenre !== undefined) {
                    genreCheck = true;
                    return true;
                }
            });

            actorList.some(actor => {
                findActor = movieActorList.find(a => a === actor);
                if (findActor !== undefined) {
                    actorCheck = true;
                    return true;
                }
            })

            if(genreCheck && actorCheck) {
                res.sug.push(movie);
            };
        }
    })
    next();

}
function respondMovie(req, res, next) {

    res.movie.Actors = res.movie.Actors.split(", ")
    res.movie.Writers = res.movie.Writer.split(", ")
    res.movie.Director = res.movie.Director.split(", ")
    res.movie.Genre = res.movie.Genre.split(", ")

    console.log(res.movie.Director);

    var total = 0;
    var count = 0;

    res.reviews.forEach(review => {
        total = total + Number(review.score);
        count++;
    });

    total = total / count;

    if (isNaN(total)) {
        req.session.noReviews = true;
    } else {
        req.session.noReviews = false;
    }

    total = Math.round(total);

    req.session.total = total;

    res.format({

        "text/html": function() {res.render("pages/movie", {movie: res.movie, reviews: res.reviews, users: res.users, sug: res.sug, session : req.session})},
        "application/json": function() {res.json(res.movie)}
    });
}

module.exports = router;