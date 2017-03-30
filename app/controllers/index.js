/**
 * Created by twohappy on 2017/3/27.
 */
const Movie = require('../models/movie');
const Category = require('../models/category');

// index page
exports.index = function (req, res) {
    Category
        .find({})
        .populate({path: 'movies', select: 'title poster', options: {limit: 5}})
        .exec(function (err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: '首页',
                categories: categories,

            });
        });
};

// search page
exports.search = function (req, res) {
    const COUNT = 2;
    let catId = req.query.cat;
    let q = req.query.q;
    let page = parseInt(req.query.p, 10) || 0;
    let index = page * COUNT;

    if (catId) {
        Category
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function (err, categories) {
                if (err) {
                    console.log(err);
                }
                let category = categories[0] || {};
                let movies = category.movies || [];
                let results = movies.slice(index, index + COUNT);
                res.render('results', {
                    title: '结果列表',
                    keyword: category.name,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / COUNT),
                    query: 'cat=' + catId,
                    movies: results,
                });
            });
    } else {
        Movie
            .find({title: new RegExp(q+'.*','i')})
            .exec(function (err, movies) {
                if (err) {
                    console.log(err);
                }
                let results = movies.slice(index, index + COUNT);
                res.render('results', {
                    title: '结果列表',
                    keyword: q,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / COUNT),
                    query: 'q=' + catId,
                    movies: results,
                });
            });
    }
};