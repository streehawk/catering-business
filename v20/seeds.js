var mongoose = require("mongoose");
var Image = require("./models/image");
var Comment = require("./models/comment");


var data = [
        {
            name: "Fried chicken breast salad",
            image: "https://www.strawberryblondiekitchen.com/wp-content/uploads/2018/01/Fried-Chicken-Sliders-2184-3.jpg",
            ingredient: "Place the breaded chicken in the saute pan and fry until crisp and golden brown. In a large bowl, toss together the romaine, tomatoes, and red onions with some of the Sweet Dijon vinaigrette. Slice the fried chicken breasts and arrange on top of the salad."
        },
        {
            name: "Fried breast plate w/Mac n cheese",
            image: "http://themusclecook.com/wp-content/uploads/2015/12/cajunsalad.jpg",
            ingredient: "Soul Food tonight, Fried Chicken, Mac and Cheese, greens, cornbread, corn and sweet potatoes. ... Make this a vegan plate ... Join us every Sunday for Soul Food Sundays- simple recipes at cooking with Tricia- Dinner recipes & more! at cookingwithtricia ... Cabbage,Greens, Chicken Breast, Candied Yams, and Cornbread."
        },
        {
            name: "Fried breast plate w/Mac n cheese",
            image: "https://skinnyms.com/wp-content/uploads/2015/11/Skillet-Chicken-Herbs-with-Garden-Salad-1-750x499.jpg",
            ingredient: "Melt 2 tbsp of butter in a pan on medium heat; add minced onion, garlic powder, salt, and pepper. Mix thoroughly. Add 4 cups of milk and 2 boxes of macaroni, and let simmer until macaroni is cooked. Then add 4 cups of cheddar cheese and mix until cheese is melted."
        },
        
    ]

function seedDB(){
    //remove all 
    //console.log("I am running");
    Image.remove({}, function(err){
        if(err){
            console.log(err);
        }
            //console.log("removed images");
            data.forEach(function(seed){
            Image.create(seed, function(err, image){
            if(err){
                console.log(err);
            }else{
                //console.log("added an image");
                // create a comment
                Comment.create(
                    {
                        text: "Crispy fried chicken salad in less than 30 minutes? Yes you can! ... Please don't get discouraged with the frying in this recipe",
                        author: "dumbass"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }else{
                            // 'comments' is an association with the image
                            image.comments.push(comment);
                            image.save();
                            console.log("comment added");
                        }
                    
                    });
                 }
             });
        });
            
    });
    //add a few images
    //add a few comments
}

module.exports = seedDB;

