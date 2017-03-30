/**
 * Created by twohappy on 2017/3/27.
 */
const Movie = require('../models/movie');
const Category = require('../models/category');
const Comment = require('../models/comment');
const moment = require('moment');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

// detail page
exports.detail = function (req, res) {
    let id = req.params.id;
    // Movie.findById(id, function (err, movie) {
    //     res.render('detail', {
    //         title: 'movie ' + movie.title+' 详情页',
    //         movie: movie
    //     });
    // });
    Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
        if (err) {
            console.log(err);
        }
    });
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
exports.new = function (req, res) {
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: '后台页',
            categories: categories,
            movie: {}
        });
    })
};

//admin update movie
exports.update = function (req, res) {
    let id = req.params.id;
    if (id) {
        Category.find({}, function (err, categories) {
            Movie.findById(id, function (err, movie) {
                res.render('admin', {
                    title: '后台更新页面',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
};

// admin poster
exports.savePoster = function (req, res, next) {
    let posterData = req.files.uploadPoster;
    let filePath = posterData.path;
    let originalFilename = posterData.originalFilename;

    console.log(req.files);
    console.log(req.poster);

    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            let timestamp = Date.now();
            let type = posterData.type.split('/')[1];
            let poster = timestamp + '.' + type;
            let newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
            fs.writeFile(newPath, data, function (err) {
                req.poster = poster;
                next();
            })
        })
    } else {
        next();
    }
};

//admin post movie

exports.save = function (req, res) {
    let id = req.body.movie._id;
    let movieObj = req.body.movie;
    let _movie;

    if (req.poster) {
        movieObj.poster = req.poster;
    }

    if (id) {
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
        _movie = new Movie(movieObj);

        let categoryId = movieObj.category;
        let categoryName = movieObj.categoryName;
        console.log(movieObj);
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    if (err) {
                        console.log(err)
                    }
                    category.movies.push(movie._id);
                    category.save(function (err, category) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            } else if (categoryName) {
                let category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                category.save(function (err, category) {
                    movie.category = category._id;
                    movie.save(function (err, movie) {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/movie/' + movie._id);
                    })
                });
            }
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
