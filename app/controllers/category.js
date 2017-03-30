/**
 * Created by twohappy on 2017/3/28.
 */
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const moment = require('moment');
const _ = require('underscore');
const Category = require('../models/category');


// admin page
exports.new = function (req, res) {
    res.render('category_admin', {
        title: '后台分类录入页',
        category:{}
    });
};


//admin post movie

exports.save = function (req, res) {
    let _category = req.body.category;

    let category = new Category(_category);
    category.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    });
};

// userlist page
exports.list = function (req, res) {
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categorylist', {
            title: '分类列表页',
            categories: categories,
            moment:moment
        });
    });
};