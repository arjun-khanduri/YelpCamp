var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');


router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err)
            console.log(err);
        else
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
    });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
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

router.post('/', middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var tempCampground = { name: name, image: image, description: desc, price: price, author: author };
    Campground.create(tempCampground, (err, temp) => {
        if (err)
            console.log(err);
        else
            res.redirect('/');
    });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

router.put('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCampground) => {
        if (err)
            res.redirect('/campgrounds');
        else
            res.redirect('/campgrounds/' + req.params.id);
    });
});

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        res.redirect('/campgrounds');
    });
});

module.exports = router;