var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err)
            console.log(err);
        else
            res.render('comments/new', { campground: campground });
    });
});

router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else{
            var text = req.body.text;
            var author = req.user.username;
            var tempComment = {text : text, author : author};
            Comment.create(tempComment, (err, comment) => {
                if (err)
                    console.log(err);
                else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

module.exports = router;