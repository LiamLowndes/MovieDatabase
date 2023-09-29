
function format(req, res, next){

  res.users.forEach(user => {
    
    user.peopleFollowed.forEach(id => {

      found = res.people.find(person => person.id === id)
      personIndex = res.people.indexOf(found);

      res.people[personIndex].followedBy.push(user.id);

    });
  });

  res.people = JSON.stringify(res.people, null, 4);
  
    fs.writeFile("./public/db/people.json", res.people, function (err,data) {
          
      if (err) {
        return console.log(err);
      }

      res.status(200).send("all good");

    });

}

function format(req, res, next){
  Math.floor(Math.random() * 27497);
  update = [];

  res.users.some(user => {

    user.peopleFollowed = [];

    numberToFollow = Math.floor(Math.random() * 100);
    dup = [];

    for (i=0; i<numberToFollow; i++) {

      newPerson = res.people[Math.floor(Math.random() * 27497)];

      if (!dup.includes(newPerson)) {
        user.peopleFollowed.push(newPerson.id);
      }
    }

    update.push(user);
    
  });

  update = JSON.stringify(update, null, 4);
  
    fs.writeFile("./public/db/users.json", update, function (err,data) {
          
      if (err) {
        return console.log(err);
      }

      res.status(200).send("all good");

    });

}




function friend(req, res, next) {

    update = []
  
    res.people.forEach(person => {
  
      allPeeps = [];
      topPeeps = [];
      movies = [];
  
      movieSearch = person.movie;
  
      movieSearch.forEach(movieID => {
  
        movies.push(res.movies.find(movie => movie.id === movieID));
  
      });
  
      movies.forEach(movie => {
        
        actors = movie.Actors.split(", ");
        actors.splice(actors.indexOf(person.name), 1);
        allPeeps = allPeeps.concat(actors);
  
      });
  
      
      unPeeps = Array.from(new Set(allPeeps))
      scorePeeps = []
      count = 0;
  
      unPeeps.forEach(peep => {
        let newPeep = [0, peep];
        scorePeeps.push(newPeep);
      })
  
      allPeeps.forEach(peep => {
  
        peepIndex = unPeeps.indexOf(peep);
        scorePeeps[peepIndex][0] = scorePeeps[peepIndex][0] + 1;
  
      })
  
      scorePeeps = scorePeeps.sort(sortFunction).reverse();
  
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
  
  }
  
  //sortFunction taken from: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
  function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
  }
  
  function clean(req, res, next) {
  
    soFar = [];
    newPeople = [];
    count = 0;
    double = 0;
  
    res.people.forEach(person => {
      if (soFar.includes(person.name)) {
        double++;
      } else {
        soFar.push(person.name);
        let temp = person;
        temp.jobs = Array.from(new Set(temp.jobs));
        temp.id = count;
        count++;
        newPeople.push(temp)
      }
    })
  
    newPeople = JSON.stringify(newPeople, null, 4);
  
  
    fs.writeFile("./public/db/people.json", newPeople, function (err,data) {
        
      if (err) {
        return console.log(err);
      }
    });
  
    res.status(200).send("all done"); 
  
  }
  
  
  function addRest(req, res, next) {
  
    var nextID = 16054;
    let update = res.people;
  
    res.movies.forEach(movie => {
  
      director = movie.Director.split(", ");
      writer = movie.Writer.split(", ");
  
      director.forEach(d => {
       
        newPerson = res.people.find(person => person.name === d);
  
  
        if (newPerson === undefined) {
          newPerson = {};
          newPerson.id = nextID;
          newPerson.name = d;
          newPerson.movie = [movie.id];
          newPerson.jobs = ["director"];
          newPerson.picture = "https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png";
          nextID++;
          update.push(newPerson);
        } else {
          if (!update[newPerson.id].jobs.includes("director")) {
            update[newPerson.id].jobs.push("director")
          };
          if (!update[newPerson.id].movie.includes(movie.id)) {
            update[newPerson.id].movie.push(movie.id);
          }
        }
  
      });
  
      writer.forEach(w => {
       
        newPerson = res.people.find(person => person.name === w);
  
  
        if (newPerson === undefined) {
          newPerson = {};
          newPerson.id = nextID;
          newPerson.name = w;
          newPerson.movie = [movie.id];
          newPerson.jobs = ["writer"];
          newPerson.picture = "https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png";
          nextID++;
          update.push(newPerson);
        } else {
          if (!update[newPerson.id].jobs.includes("writer")) {
            update[newPerson.id].jobs.push("writer");
          };
          if (!update[newPerson.id].movie.includes(movie.id)) {
            update[newPerson.id].movie.push(movie.id);
          }
        }
  
      });
  
    });
  
    update = JSON.stringify(update, null, 4);
  
    fs.writeFile("./public/db/people.json", update, function (err,data) {
          
      if (err) {
        return console.log(err);
      }
    });
    
    res.status(200).send("all done"); 
  
  }
  
  
  function fa1(req, res, next) {
  
    fs.readFile("./public/db/people.json", function(err, people){
          
      if(err) {
          res.status(500).send("Error reading people.");
          return;
      }
  
      res.people = JSON.parse(people);
      next();
    });
  }
  
  function fa2(req, res, next) {
  
    fs.readFile("./public/db/movie-data.json", function(err, movies){
          
      if(err) {
          res.status(500).send("Error reading movies.");
          return;
      }
  
      res.movies = JSON.parse(movies);
      next();
      })
  
  }
  
  function fa3(req, res, next) {
  
    updates = [];
  
    res.movies.forEach(movie => {
  
      actors = movie.Actors.split(", ");
  
      actors.forEach(actor => {
  
        found = res.people.find(person => person.name === actor);
  
        let newPerson = found;
  
        if (!found.movie.includes(movie.id)) {
          newPerson.movie.push(movie.id);
          updates.push(newPerson);
        } else {
          updates.push(newPerson);
        }
  
  
      })
  
    })
  
    updates = JSON.stringify(updates, null, 4);
  
    fs.writeFile("./public/db/people.json", updates, function (err,data) {
          
      if (err) {
        return console.log(err);
      }
    });
  
    res.status(200).send("all done!");
  
  }
  
  function formatActors(req, res, next) {
  
    temp = []
  
    fs.readFile("./public/db/movie-data.json", function(err, movies){
          
      if(err) {
          res.status(500).send("Error reading movies.");
          return;
      }
  
      movies = JSON.parse(movies);
      res.peopleTotal = 0;
  
      soFar = [];
  
      movies.some(movie => {
  
        actorBatch = movie.Actors.split(", ");
        directorBatch = movie.Director.split(", ");
        writerBatch = movie.Writer.split(", ");
  
        actorBatch.forEach(actor => {
  
          if (!soFar.includes(actor)) {
              
            soFar.push(actor);
  
            let newActor = {};
            newActor.id = res.peopleTotal;
            newActor.name = actor;
            newActor.movie = [movie.id];
            newActor.jobs = ["Actor"];
            newActor.picture = 'https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png';
            temp.push(newActor);
            res.peopleTotal++;
          } 
  
            
        });
  
        directorBatch.forEach(director => {
  
          if (!soFar.includes(director)) {
              
            soFar.push(director);
  
            let newDirector = {};
            newDirector.id = res.peopleTotal;
            newDirector.name = director;
            newDirector.movie = [movie.id];
            newDirector.jobs = ["Director"];
            newDirector.picture = 'https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png';
            temp.push(newDirector);
            res.peopleTotal++;
  
          } 
  
            
        });
  
        writerBatch.forEach(writer => {
  
          writer = writer.split(" ");
  
            for (i=0; i<writer.length; i++) {
              if (writer[i].charAt(0) === "(") {
                writer.splice(i);
              }
            }
  
            writer = writer.join(" ");
  
          if (!soFar.includes(writer)) {
  
            soFar.push(writer);
  
            let newWriter = {};
            newWriter.id = res.peopleTotal;
            newWriter.name = writer;
            newWriter.movie = [movie.id];
            newWriter.jobs = ["Writer"];
            newWriter.picture = 'https://www.utas.edu.au/profiles/staff/biological-sciences/morgan-green/UTAS-Default-Profile-Pic.png/profile_image.png';
            temp.push(newWriter);
            res.peopleTotal++;
  
          } 
  
            
        });
  
      })
      
      temp = JSON.stringify(temp, null, 4);
  
        fs.writeFile("./public/db/people.json", temp, function (err,data) {
          
          if (err) {
            return console.log(err);
          }
        });
  
        res.status(200).send("all done!");
  
      });  
  
  }
  
  function fm2(req, res, next) {
  
    let newMovies = [];
    var movieID = -1
    var outCount = 9;
    var inCount = 0;
  
    res.movies.forEach(movie => {
  
      movieID++;
      movie.id = movieID;
      movie.reviews = [outCount + inCount];
      newMovies.push(movie);
      
      inCount = inCount + 3;
  
      if (inCount === 9) {
        inCount = 0;
        outCount++;
      }
  
      newStr = ""
      writerBatch = movie.Writer.split(", ")
  
      writerBatch.forEach(writer => {
  
        writer = writer.split(" ");
  
        for (i=0; i<writer.length; i++) {
          if (writer[i].charAt(0) === "(") {
            writer.splice(i);
          }
        }
  
        newStr += writer.join(" ");
        newStr += ", ";
  
      });
      newStr = newStr.slice(0, newStr.length - 2);
      movie.Writer = newStr;
    });
  
    newMovies = JSON.stringify(newMovies, null, 4);
  
    fs.writeFile("./public/db/movie-data.json", newMovies, function (err,data) {
        
      if (err) {
        return console.log(err);
      }
    });
  
    res.status(200).send("all done!");
  
  
  }
  
  function fm1(req, res, next) {
  
    fs.readFile("./public/db/movie-data.json", function(err, movies) {
  
        res.movies = JSON.parse(movies);
        next();
      })
  }
  
  
  function formatReviews(req, res, next) {
  
    temp = []
  
      fs.readFile("./public/db/users.json", function(err, users) {
          
        if(err) {
            res.status(500).send("fail");
            return;
        };
  
        users = JSON.parse(users);
  
        let movieID = -1;
  
        users.forEach(user => {
  
          let reviewCount = 1;
  
          user.reviews.forEach(review => {
  
            movieID++;
  
            let newReview = {};
  
            newReview.id = review;
            newReview.user = user.username;
            newReview.summary = "This is review " + reviewCount + " by " + user.username + ".";
            newReview.review = "This reviewer has only displayed their score for the movie.";
            newReview.score = Math.floor(Math.random() * 11);
            newReview.movie = movieID;
  
            reviewCount++;
            temp.push(newReview);
  
          })
  
        })
  
        temp = JSON.stringify(temp, null, 4);
  
        fs.writeFile("./public/db/reviews.json", temp, function (err,data) {
          
          if (err) {
            return console.log(err);
          }
        });
  
        res.status(200).send("all done!");
  
      });
  
    res.status(200);
  
  }
  
  function formatUsers(req, res, next) {
  
    Math.floor(Math.random() * 11); //1 to 10
  
    temp = []
    count = 0;
    a = 9;
    b = 12;
    c = 15;
  
    for (i=0; i<98; i++) {
      
      let newUser = {};
      let name = humans.allRandom();
  
      newUser.id = 3 + i;
      newUser.username = name;
      newUser.password = name;
      newUser.following = []
      newUser.followers = []
  
      if (count === 2) {
        newUser.reviews = [a+count, b+count, c+count];
        count = 0;
        a = a + 9;
        b = b + 9;
        c = c + 9;
      } else {
        newUser.reviews = [a+count, b+count, c+count];
        count++;
      }
      
  
  
  
      for (j=0; j<Math.floor(Math.random() * 51); j++) {
        var newNum = Math.floor(Math.random() * 95);
        
        newUser.following.push(newNum);
  
      }
  
      for (j=0; j<Math.floor(Math.random() * 51); j++) {
        var newNum = Math.floor(Math.random() * 95);
        
        newUser.followers.push(newNum);
  
      }
  
      newUser.following = new Set(newUser.following);
      newUser.following = Array.from(newUser.following);
  
      newUser.followers = new Set(newUser.followers);
      newUser.followers = Array.from(newUser.followers);
      
  
  
      newUser.followers.push(Math.floor(Math.random() * 11));
  
      newUser.bio = "This is " + name + "'s bio. They haven't written anything yet!"
      newUser.contributor = false;
      newUser.picture = coolImages.one(400, 250);
  
      temp.push(newUser);
  
    }
  
    console.log(temp);
  
    temp = JSON.stringify(temp, null, 4);
  
    fs.writeFile("./public/db/users.json", temp, function (err,data) {
          
      if (err) {
        return console.log(err);
      }
    });
  
    res.status(200).send("all good!")
  
  };