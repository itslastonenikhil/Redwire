var Block     = require("../models/block");
var Comment   = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwner = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "COMMENT NOT FOUND !");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id == req.user._id.toString()){
                    next();
                }
                else{
                    req.flash("error", "PERMISSION DENIED !");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "YOU ARE NOT LOGGED IN !");

        res.redirect("back");
    }
}

middlewareObj.checkBlockOwner = function (req, res, next){
    if(req.isAuthenticated()){
        Block.findById(req.params.id, function(err, foundBlock){
            if(err){
                req.flash("error", "BLOCK NOT FOUND !");
                res.redirect("back");
            }
            else{
                if(foundBlock.author.id == req.user._id.toString()){
                    next();
                }
                else{
                    req.flash("error", "PERMISSION DENIED");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "YOU NEED TO BE LOGGED IN");
        res.redirect("back");
    }
}

module.exports = middlewareObj;