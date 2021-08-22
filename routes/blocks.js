var express    = require("express");
var mongoose   = require("mongoose");
var Block      = require("../models/block");
var Comment    = require("../models/comment");
var middleware = require("../middleware/index") // automatically requires index.js
var router     = express.Router();
//====================================
// BLOCK ROUTES
//====================================

//listing the BLOCKS
router.get("/", function(req, res){
    Block.find({}, function(err, allBlock){
        if(err){
            console.log(err);
        }
        else{
            res.render("blocks/index.ejs", {block : allBlock});
        }
    })
});

router.post("/",middleware.isLoggedIn, function(req, res){
    //get data from the array
    //redirect back to blocks
    //----------------------------------------------------
    var sanitized_desc = req.sanitize(req.body.description); //sanitizing the code...
    //----------------------------------------------------
        var name    = req.body.name;
        var images  = req.body.image;
        var desc    = sanitized_desc;
        var author  = {
            id : req.user._id,
            username : req.user.username
        }
        var newBlock = {name : name ,image : images, description : desc, author: author}
    

    Block.create(newBlock, function(err,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/block");
        }
    })
       
    
    });

router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("blocks/new.ejs");
});

//this is the show page
router.get("/:id",function(req, res){
   //find the campground with ID
    Block.findById(req.params.id).populate("comments").exec(function(err, foundBlock){
        if(err){
            console.log(err);
        }
        else{
            //render the show template
            res.render("blocks/show.ejs", {block: foundBlock});
        }
    });
   
});


//edit 
router.get("/:id/edit",middleware.checkBlockOwner, function(req, res){

    Block.findById(req.params.id, function(err, foundBlock){
        if(err){
            req.flash("error", "BLOCK NOT FOUND !");
            res.redirect("back");
        }
        else{
            res.render("blocks/edit.ejs", {block: foundBlock});
        }
        
    });
});


//update
router.put("/:id",middleware.checkBlockOwner, function(req, res){
    //find and update the correct campground


    //campground[name], campground[description], campground[image] to use req.body.campground
    Block.findByIdAndUpdate(req.params.id, req.body.block,function(err, updatedBlock){
        if(err){
            res.redirect("/block");
        }
        else{
            res.redirect("/block/" + req.params.id);
        }
    });
});


//delete
router.delete("/:id",middleware.checkBlockOwner, function(req, res){
    Block.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/block");
        }else{
            res.redirect("/block");
        }

    })
})


module.exports = router;
