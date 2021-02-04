var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');

seedDB();
// var Comment = require('./models/comment');
// var User = require('./models/user');


mongoose.connect("mongodb://localhost/YelpCamp", { useUnifiedTopology: true, useNewUrlParser: true });



var campgrounds = [{ name: 'Selmon Bhai', image: 'https://simg-memechat.s3.ap-south-1.amazonaws.com/74d7259d8bf4ad4a812a111d822ec2c5.jpg' }]

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err)
            console.log(err);
        else
            res.render('index', { campgrounds: campgrounds });
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err)
            console.log(err);
        else {
            console.log(foundCampground);
            res.render('show', { campground: foundCampground });

        }
    });

})

app.post('/campgrounds', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var tempCampground = { name: name, image: image, description: desc };
    Campground.create(tempCampground, (err, temp) => {
        if (err)
            console.log(err);
        else
            res.redirect('/campgrounds');
    });
});


app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000');
});

