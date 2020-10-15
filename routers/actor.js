const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        minAge = req.query.min_age
        maxAge = req.query.max_age 
        if (minAge !== undefined || maxAge !== undefined && (minAge !== undefined && maxAge !== undefined)) {
            if (Number.isInteger(Number(minAge)) && Number.isInteger(Number(maxAge))) {
                let d = new Date()
                let minYear = d.getFullYear() - parseInt(maxAge, 10)
                let maxYear = d.getFullYear() - parseInt(minAge, 10)
                Actor.where('bYear').gte(minYear).lte(maxYear).populate('movies').exec(function (err, actors) {
                    if (err) return res.status(400).json(err);
                    if (actors.length == 0) return res.status(404).json()
                    res.json(actors);
                });
            } else {
                res.status(400).json();
            }

        } else {
            Actor.find()
            .populate('movies')
            .exec(function (err, actors) {
                if (err) return res.status(400).json(err);
                res.json(actors);
            });
        }

    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            if (err) return res.status(400).json(err);
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    deleteActorMovies: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            let movies = actor.movies
            Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
                if (err) return res.status(500).json(err);
            });
            Movie.deleteMany({_id: {$in: movies}}, function(err, result) {
                if (err) return res.status(500).json(err);
            });
            res.json(actor);
        });
    },
    deleteMovieFromActor: function (req, res) {
        let actorID = req.params.actorid
        let movieID = req.params.movieid
        Actor.updateOne( {_id: actorID}, { $pullAll: {movies: [movieID] } }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        })
        
    }
};