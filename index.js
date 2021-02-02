var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var campgrounds = [{name: 'Selmon Bhai', image: 'https://simg-memechat.s3.ap-south-1.amazonaws.com/74d7259d8bf4ad4a812a111d822ec2c5.jpg'}]

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
})

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.post('/campgrounds', (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var tempCampground = {name: name, image: image}; 
    campgrounds.push(tempCampground);
    res.redirect('/campgrounds');
});


app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000');
});
