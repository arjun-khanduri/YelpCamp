var express=require("express");
var app=express();
var bodyParser = require("body-parser");
var mongoose =require("mongoose");
app.use(bodyParser.urlencoded({extended: true}));
var Campground = require("./models/campground"),
    seedDB=require("./seeds");
var Comment = require("./models/comment");
    //Comment=require("./models/comment")
    //User=require("./models/user")
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true,useUnifiedTopology:true});



//SCHEMA SETUP
/*Campground.create({
   name: "Ryan Rosling", image: "https://cdn-cloudfront.cfauthx.com/binaries/content/gallery/kd-en-us/ctas/stay/kd-tentsites-cta.jpg"
}, function(err, campground){
    if(err)
        console.log("Error");
    else
        console.log("Succesfully created\n"+campground);
});*/
 /*var campgrounds=[{name: "Salmon Creek", image: "https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525"},{name: "Ryan Rosling", image: "https://cdn-cloudfront.cfauthx.com/binaries/content/gallery/kd-en-us/ctas/stay/kd-tentsites-cta.jpg"},{name: "Chris Brenner",  image: "http://www.pyreneesemotions.com/wp-content/uploads/2019/01/DSC_4189-1024x683.jpg"}];*/




app.get("/",function(req,res){
    res.render("landing");
    //res.send("This will be the home page");
});



app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campground){
        if(err)
            console.log("Something went wrong");
        else
            res.render("campgrounds/index",{campgrounds:campground});     
    });
});



app.listen(3000,function(req,res){
    console.log("Yelp Camp server online");
});




app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newCampground={name:name,image:image};
    Campground.create(newCampground,function(err,campground){
        if(err)
            console.log("Something went wrong");
        else
            res.redirect("/campgrounds");
    })
    //campgrounds.push(newCampground);
});




app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
});



app.get("/campgrounds/:id", function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err)
            console.log("Something went wrong");
        else
            res.render("campgrounds/show",{campground: foundCampground});
    });
});


app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
            console.log(err);
        else{
            res.render("comments/new",{campground:campground});    
        }
    });
});


app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    })
});