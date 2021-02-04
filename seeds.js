var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {
        name: "Camp Monk",
        image: "https://s3.ap-south-1.amazonaws.com/campmonk.com/blogs/5879f8e0-5be4-11e8-a7bc-5f5bfad23fd4-1200-1200.jpeg",
        description: "Very good"
    },
    {
        name: "Salmon Creek",
        image: "https://s3.ap-south-1.amazonaws.com/campmonk.com/blogs/13953a50-fde7-11e7-80f0-b31b796f143a-1200-1200.jpeg",
        description: "Nice one"
    }
];


seedDB = () => {
    Campground.remove({}, (err) => {
        if (err)
            console.log(err);
        else
            console.log("Removed everything from campground");
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if (err)
                    console.log(err);
                else {
                    console.log("Updated Database");
                    Comment.create(
                        {
                            text: "This is a good place",
                            author: "Arjun Khanduri"
                        }, (err, com) => {
                            if (err)
                                console.log(err);
                            else {
                                campground.comments.push(com);
                                campground.save();
                                console.log("Created Comment");
                            }
                        }
                    )
                }
            })
        })
    })

}

module.exports = seedDB;