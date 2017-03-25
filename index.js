/**
 * Created by twohappy on 2017/3/23.
 */
let express = require('express');
let mongoose = require('mongoose');
let _ = require('underscore');
let serveStatic = require('serve-static');
let bodyParser = require('body-parser');
let Movie = require('./models/movie');
let moment = require('moment');

let port = process.env.PORT || 3000;
let app = express();

const MONGOPORT = 12345;
const MONGOCOLLECTION = 'movie';
// 修改你的端口号
mongoose.connect('mongodb://localhost:' + MONGOPORT + '/' + MONGOCOLLECTION);

app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));
app.listen(port);

console.log('started on port ' + port);

// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    });
});
// detail page
app.get('/movie/:id', function (req, res) {
    let id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'movie' + movie.title,
            movie: movie
        });
    });
});

// admin page
app.get('/admin/movie', function (req, res) {
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
});

//admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页面',
                movie: movie
            });
        });
    }
});

//admin post movie

app.post('/admin/movie/new', function (req, res) {
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
});

// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies,
            moment: moment
        });
    });
});
//list delete movie
app.delete('/admin/list', function (req, res) {
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
});