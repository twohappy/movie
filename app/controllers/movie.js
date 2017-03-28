/**
 * Created by twohappy on 2017/3/27.
 */
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const moment = require('moment');
const _ = require('underscore');

// detail page
exports.detail = function (req, res) {
    let id = req.params.id;
    // Movie.findById(id, function (err, movie) {
    //     res.render('detail', {
    //         title: 'movie ' + movie.title+' 详情页',
    //         movie: movie
    //     });
    // });
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie: id})
            // 之后看看populate方法
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                res.render('detail', {
                    title: 'movie ' + movie.title + ' 详情页',
                    movie: movie,
                    comments: comments
                });
            });
    });
};

// admin page
exports.save = function (req, res) {
    res.render('admin', {
        title: '后台页',
        movie: {
            director: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
};

//admin update movie
exports.update = function (req, res) {
    let id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页面',
                movie: movie
            });
        });
    }
};

//admin post movie

exports.new = function (req, res) {
    let id = req.body.movie._id;
    let movieObj = req.body.movie;
    let _movie;
    if (id !== 'undefined' && id !== '') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        console.log(movieObj);
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
};

// list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        console.log(movies);
        res.render('list', {
            title: '列表页',
            movies: movies,
            moment: moment
        });
    });
};
//list delete movie
exports.del = function (req, res) {
    let id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
};
