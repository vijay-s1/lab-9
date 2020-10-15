// https://hub.packtpub.com/building-movie-api-express/


/*
ACTOR:
    CREATE ACTOR:
        POST /actors
            {
                "name":"Alex",
                "bYear":1980
            }

    GET ONE ACTOR: 
        GET /actors/:id

    GET ALL ACTORS: 
        GET /actors

    UPDATE ONE ACTOR:
        PUT /actors/:id
            {
                "name":"Updated Actor",
                "bYear":2000
            }

    ADD MOVIE TO ACTOR:
        POST /actors/:id/movies

    DELETE ACTOR:
        DELETE /actors/:id

    REMOVE MOVIE FROM LIST OF MOVIES FROM ACTOR
        DELETE /actors/:actorid/:movieid

    DELETE AN ACTOR & ITS MOVIES
        DELETE /actors/:id/deleteMovies

MOVIE:
    ADD MOVIE:
        POST /movies
            {
                "title": "T1",
                "year": 2001
            }

    GET ONE MOVIE:
        GET /movies/:id

    GET ALL MOVIES:
        GET /movies
    
    GET ALL MOVIES BETWEEN YEARS:
        GET /movies/:year1/:year2

    UPDATE MOVIE:
        PUT /movies/:id
            {
                "title": "Updated Title",
                "year": 1968
            }

    ADD ACTOR TO MOVIE
        POST /movies/:movieid/:actorid

    DELETE MOVIE BY ID
        /movies/:id

    DELETE ACTOR FROM ACTORS LIST IN MOVIE
        DELETE /movies/:movieid/:actorid
    
    DELETE MOVIES BETWEEN YEARS:
        DELETE /movies/betweenyears 
            {
                "year1": xxxx,
                "year2": xxxx
            }
*/

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
const path = require('path');
const app = express();

app.listen(8080);
app.use("/", express.static(path.join(__dirname, "dist/lab9")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        console.log('Mongoose - connection error:', err);
    } else {
        console.log('Connect Successfully');
    }
});

// Configuring Endpoints

// Actor RESTful endpoints 
// UPDATED IMPLEMENTATION: movies array now contains actual movies instead of reference _ids
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
// Delete an actor and all its movies
app.delete('/actors/:id/deleteMovies', actors.deleteActorMovies);
// Remove a movie from the list of movies of an actor
app.delete('/actors/:actorid/:movieid', actors.deleteMovieFromActor);

// Movie RESTful endpoints
// Delete all movies produced between 2 years
app.delete('/movies/betweenyears', movies.deleteMoviesBetweenYears);
// UPDATED IMPLEMENTATION: actors array now contains actual actors instead of reference _ids
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
// Delete a movie by its ID
app.delete('/movies/:id', movies.deleteOne);
// Remove an actor from the list of actors in a movie
app.delete('/movies/:movieid/:actorid', movies.deleteActor);
// Add an existing actor to the list of actors in a movie
app.post('/movies/:movieid/:actorid', movies.addActor);
// Retrieve (GET) all the movies produced between year1 and year2, where year1 > year2
app.get('/movies/:year1/:year2', movies.getMoviesBetweenYears);

// Get all the actors who fall in the giving min and max age range
// e.g. /actors/?min_age=25&max_age=30
