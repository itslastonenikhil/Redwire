var express     = require("express");
var Block  = require("../models/block");
var Comment     = require("../models/comment");
var middleware  = require("../middleware") // automatically requires index.js
var router      = express.Router({mergeParams : true}); // use common start for id

//========================================
//          Comments routes
//========================================

//comments new -----------------------
router.get("/new", middleware.isLoggedIn,function(req,res){
    Block.findById(req.params.id, function(err, block){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new.ejs", {block: block});
        }
        
    })
    
})


// comments create --------------------
router.post("/", middleware.isLoggedIn,function(req, res){
    //lookup block using ID
    Block.findById(req.params.id, function(err, block){
        if(err){
            console.log(err);
            res.redirect("/blocks");
        }
        else{
             Comment.create(req.body.comment, function(err, comment){
                 if(err){
                    req.flash("error", "SOMETHING WENT WRONG !");
                    console.log(err);
                 }
                 else{
                    //add username and id to comment
                    // console.log(req.user.username);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    block.comments.push(comment);
                    block.save();

                    req.flash("success", "SUCCESSFULLY ADDED COMMENT");
                    res.redirect('/block/' + block._id);
                 }
             })
        }
    })

})


//comments edit -----------------------
router.get("/:comment_id/edit", middleware.checkCommentOwner,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit.ejs", {block_id: req.params.id, comment: foundComment});
        }
    });
});

//comments update ---------------------
router.put("/:comment_id",middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "COMMENT UPDATED !");
            res.redirect("/block/" + req.params.id);
        }
    })
});

router.delete("/:comment_id",middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            console.log(err);
            req.flash("error", "CANNOT DELETE COMMENT !");
            res.redirect("back");
        }
        else{
            req.flash("success", "COMMENT DELETED !");
            res.redirect("/block/" + req.params.id);
        }
    });
});


module.exports = router;