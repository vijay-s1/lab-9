const mongoose = require('mongoose');
var Actor = require('../models/actor');
var Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        Movie.find()
            .populate('actors')
            .exec(function (err, movies) {
                if (err) return res.status(400).json(err);
                res.json(movies);
            });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
            
        });
    },
    deleteActor: function (req, res) {
        let movieID = req.params.movieid;
        let actorID = req.params.actorid;

        Movie.updateOne( {_id: movieID}, {$pullAll: {actors: [actorID]}}, function (err){
            if (err) return res.status(400).json(err);
            res.json();
        })
    },
    addActor: function (req, res) {
        let movieID = req.params.movieid;
        let actorID = req.params.actorid;

        Movie.findOneAndUpdate({ _id: movieID }, {$push: {actors: actorID}}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    getMoviesBetweenYears: function (req, res) {
        let year1 = req.params.year1;
        let year2 = req.params.year2;
        
        Movie.where('year').gte(year1).lte(year2).exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    deleteMoviesBetweenYears: function (req, res) {
        let year1 = req.body.year1;
        let year2 = req.body.year2;
        
        Movie.deleteMany({year: {$gte: year1, $lte: year2}}, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    }

};