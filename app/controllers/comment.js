/**
 * Created by twohappy on 2017/3/27.
 */
let Comment = require('../models/comment');

// comment
exports.save = function (req, res) {
    let _comment = req.body.comment;
    let movieId = _comment.movie;

    if (_comment.cid) {
        Comment.findById(_comment.cid, function (err, comment) {
            let reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };

            comment.reply.push(reply);

            comment.save(function (err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movieId);
            });
        });
    }else{
        let comment = new Comment(_comment);
        // console.log("************"+"\n")
        // console.log(comment);
        comment.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        });
    }
};
