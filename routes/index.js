var express = require("express");
var router  = express.Router();
var passport  = require("passport");
var User    = require("../models/user");



//=================================
// AUTHENTICATION ROUTES
//=================================

//show register form

router.get("/register", function(req, res){
    res.render("index/register.ejs");
});

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username
    });

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("index/register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to App " + user.username );
            res.redirect("/block");
        });
    });
});

// show login form

router.get("/login", function(req, res){
    res.render("index/login.ejs");
});

router.post("/login", passport.authenticate("local",{      // using passport.use(new LocalStrategy( User.authenticate() ))
        successRedirect: "/block",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
    
});

//logout route

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;