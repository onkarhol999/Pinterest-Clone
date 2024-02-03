var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');

//user login hota hai yis ki vajah se
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});



router.get('/feed', function(req, res, next) {
  res.render('feed');
});

//profile
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render("profile");
});

router.post("/register",  function(req,res){
  //Another Option
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

userModel.register(userData, req.body.password)
  .then(function(){
     passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

//login
router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login"
}),function(req,res){
})

//logout
router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect("/login");
}

module.exports = router;
