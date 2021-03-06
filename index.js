var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');
var methodOverride = require('method-override');
var flash = require('connect-flash');

mongoose.connect("mongodb://localhost/YelpCamp", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: "Sample Hash",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public/'));
console.log(__dirname);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000');
});