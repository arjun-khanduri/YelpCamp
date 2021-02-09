var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');
var passport = require('passport');
var LocalStrategy = require('passport-local');


seedDB();


mongoose.connect("mongodb://localhost/YelpCamp", { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: "Sample Hash",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public/'));
console.log(__dirname);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err)
            console.log(err);
        else
            res.render('campgrounds/index', { campgrounds: campgrounds });
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err)
            console.log(err);
        else {
            console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });

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

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err)
            console.log(err);
        else
            res.render('comments/new', {campground: campground});
    })
})

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }
        else
            Comment.create(req.body.comment, (err, comment) => {
                if(err)
                    console.log(err);
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })

    })
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    var newUser = new User({username:  req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
})

app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000');
});

