var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err)
                res.redirect('back');
            else {
                if (foundComment.author.id.equals(req.user._id))
                    next();
                else
                    res.redirect('back');
            }
        });
    }
    else {
        res.redirect('back');
    }
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
        else {
            var text = req.body.text;
            var author = {
                id: req.user._id,
                username: req.user.username,
            };
            var tempComment = { text: text, author: author };
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


router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err)
            res.redirect('back');
        else
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
    });
});

router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err)
            res.redirect('back');
        else
            res.redirect('/campgrounds/' + req.params.id);
    })
});

router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err)
            res.redirect('back');
        else
            res.redirect('/campgrounds/' + req.params.id);
    });
});

module.exports = router;