function qP(req, res) {
    
    //max amount of movies per page
    const MAX_MOVIES = 3;

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

    if(req.query.minyear){
		try{
			req.query.minyear = Number(req.query.minyear);
		}catch(err){
			req.query.minyear = undefined;
		}
    }
    
    if(req.query.maxyear){
		try{
			req.query.maxyear = Number(req.query.maxyear);
		}catch(err){
			req.query.maxyear = undefined;
		}
    }
    
    if(!req.query.name){
		req.query.name = "*";
    }
    
    return(req);
};

module.exports = qp(req, res);

/*

function searchLoad(req, res, next){
    fs.readdir("./public/db/movies", function(err, movieFiles){
        if(err) {
            res.status(500).send("Error reading files 1.");
            return;
        }

        res.movies = [];
        let count = 0

        let startIndex = (req.query.page-1) * Number(req.query.limit);
        let endIndex = startIndex + Number(req.query.limit);

        movieFiles.forEach(file => {

            fs.readFile("./public/db/movies/" + file, function(err, movie){
                if(err) {
                    res.status(500).send("Error reading files 2.");
                    return;
                }
                
                movie = JSON.parse(movie);
                
                if (movieMatch(movie, req.query)) {
                    
                    if (count >= startIndex) {
                        res.movies.push(movie);
                    }    
                    count++;
                }
                console.log(count, endIndex);
                if (count == endIndex) {
                    console.log("MOVIE SERVED");
                    return(req);
                };
            });
        });
    });

}

//code taken from express lectrue 14 by David Mckenney
//Helper function for determining whether a product
// matches the query parameters. Compares the name,
// min price, and max price. All must be true.
//Again, different systems may have different logic

function movieMatch(movie, query){
	let nameCheck = query.name == "*" || movie.Title.toLowerCase().includes(query.name.toLowerCase());
	let minYearCheck = (!query.minyear) || movie.Year >= query.minyear;
	let maxYearCheck = (!query.maxyear) || movie.Year <= query.maxyear;
	return nameCheck && minYearCheck && maxYearCheck;
}

module.exports = router;*/