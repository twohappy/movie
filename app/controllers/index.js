/**
 * Created by twohappy on 2017/3/27.
 */
const Movie = require('../models/movie');

// index page
exports.index = function (req, res) {

    console.log('user in session');
    console.log(req.session.user);

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies,

        });
    });
};
