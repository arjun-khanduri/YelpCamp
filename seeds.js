var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment=require("./models/comment");

data=[
    {
        name:"Some nice place",
        image: "https://cdn-cloudfront.cfauthx.com/binaries/content/gallery/kd-en-us/ctas/stay/kd-tentsites-cta.jpg",
        description: "This is definitely a nice place to go to."
    },
    {
        name: "Salmon Creek",
        image: "https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525",
        description: "That's a nice place too I guess"
    }
]

function seedDB(){
    Campground.remove({},function(err){
    if(err)
        console.log(err);
    else
        console.log("Removed");
    });
    data.forEach(function(seed){
      Campground.create(seed, function(err,campground){
          if(err)
              console.log(err);
          else{
              console.log("Added");              
              Comment.create({
                  text: "This is a good place",
                  author: "Arjun Khanduri"
              },function(err,comment){
                  if(err)
                      console.log(err);
                  else{
                      campground.comments.push(comment);
                      campground.save();
                      console.log("Created comment");
                  }
              });
            }
        }); 
    });
};

module.exports=seedDB;