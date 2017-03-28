/**
 * Created by twohappy on 2017/3/27.
 */
const User = require('../models/user');
const moment = require('moment');

//signup
// userlist page
exports.showSignin = function (req, res) {
    res.render('signin', {
        title: '登陆页'
    });
};
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册页'
    });
};
exports.signup = function (req, res) {
    // 这里有 req.body.userid req.params.userid 和 req.param('userid') 不同请看express（文档/源码）
    let _user = req.body.user;

    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        } else {
            let user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            });
        }
    })

};
//signin
exports.signin = function (req, res) {
    let _user = req.body.user;
    let name = _user.name;
    let password = _user.password;

    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function (err, isMatched) {
            if (err) {
                console.log(err);
            }
            if (isMatched) {
                console.log("password is matched");
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
            }
        });
    });
};
// logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
};
// userlist page
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users,
            moment: moment
        });
    });
};

// middleware for user
exports.signinRequired = function (req,res,next) {
    let user = req.session.user;
    if(!user){
        return res.redirect(('/signin'));
    }
    next();
};

exports.adminRequired = function (req,res,next) {
    let user = req.session.user;
    if(user.role<=10){
        return res.redirect(('/signin'));
    }
    next();
};