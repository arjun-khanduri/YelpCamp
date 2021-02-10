var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err)
            console.log(err);
        else
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
    });
});

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err)
            console.log(err);
        else {
            console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });

        }
    });

});

router.post('/', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var tempCampground = { name: name, image: image, description: desc };
    Campground.create(tempCampground, (err, temp) => {
        if (err)
            console.log(err);
        else
            res.redirect('/');
    });
});

 module.exports = router;