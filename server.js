const express = require('express');
const session = require('express-session');
const app = express();
const config = require("./config.json");
const fs = require("fs");

const searchRoutes = require("./search-router");
const moviesRoutes = require("./movies-router");
const indexRoutes = require("./index-router");
const usersRoutes = require("./users-router");
const movieSubmitRoutes = require("./movieSubmit-router");
const peopleRoutes = require("./people-router");
const followingRoutes = require("./following-router");
const followedByRoutes = require("./followedBy-router");
const notificationsRoutes = require("./notifications-router");

app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	console.log(req.get("Content-Type"));
	next();
});

app.use(session({ secret: 'testing'}))
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/notifications", notificationsRoutes);
app.use("/followedBy", followedByRoutes);
app.use("/search", searchRoutes);
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/movieSubmit", movieSubmitRoutes);
app.use("/people", peopleRoutes);
app.use("/following", followingRoutes);
app.use("/", indexRoutes);



app.listen(3000);
console.log("Server listening at http://localhost:3000");

