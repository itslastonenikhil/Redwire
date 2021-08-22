var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose        = require("mongoose");
var moment          = require("moment");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");
var dotenv			= require("dotenv")

dotenv.config();
//=======================================
//  REQUIRE MODELS AND ROUTES
//=======================================
var Block           = require("./models/block");
var Comment         = require("./models/comment");
var User            = require("./models/user");
var commentRoutes   = require("./routes/comments");
var blockRoutes     = require("./routes/blocks");
var indexRoutes     = require("./routes/index");

//========================================
//  MONGOOSE CONFIGURATION
//========================================
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect(process.env.DATABASEURL);
mongoose.connect(process.env.MONGO_URI);
// mongoose.connect("mongodb://localhost/app");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //should be after body-parser
app.use(flash());

app.set("view engine", "ejs");

app.locals.moment = require('moment');
//========================================
//  PASSPORT CONFIGURATION
//========================================
app.use(require("express-session")({
    secret: "[]{}:<>$%@#()*&alskdjfhgqpwoeiruty1234567890zmxncbv ",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PASSING USER TO EVERY TEMPLATE
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.info         = req.flash("info");
    res.locals.message      = req.flash("message");
    next();
});

//========================================
// ROUTES CONFIGURATION
//========================================
app.use(indexRoutes);
app.use("/block/:id/comments",commentRoutes); // {mergeParams : true} in routes
app.use("/block",blockRoutes);

app.get("/", function(req, res){
    res.render("index/landing.ejs");
});

//=========================================
// CREATING SERVER
//=========================================

app.listen(process.env.PORT||3000, process.env.IP, function () {
    console.log("The Server Has Started");
    //console.log(PORT);
 });
