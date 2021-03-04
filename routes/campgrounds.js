var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err)
            console.log(err);
        else
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
    });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err)
            console.log(err);
        else {
            res.render('campgrounds/show', { campground: foundCampground });

        }
    });

});

router.post('/', isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var tempCampground = { name: name, image: image, description: desc, author : author };
    Campground.create(tempCampground, (err, temp) => {
        if (err)
            console.log(err);
        else
            res.redirect('/');
    });
});

router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err)
            res.redirect('/campgrounds');
        else
            res.render('campgrounds/edit', {campground: foundCampground});
    });
});

router.put('/:id/edit', (req, res) =>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground) => {
        if(err)
            res.redirect('/campgrounds');
        else
            res.redirect('/campgrounds/' + req.params.id);
    });
});

router.delete('/:id', (req, res) =>{
    Campground.findByIdAndRemove(req.params.id, (err) => {
        res.redirect('/campgrounds');
    });
});

module.exports = router;