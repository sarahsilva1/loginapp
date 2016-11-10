var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/user');

// Register
router.get('/register', function(req, res){
   res.render('register');
});

router.get('/login', function(req, res){
   res.render('login');
});

// Register
router.post('/register', function(req, res){
   var name = req.body.name;
   var email = req.body.email;
   var username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;

// validation
	 req.checkBody('name', 'Name is required').notEmpty();
	 req.checkBody('email', 'Email is required').notEmpty();
	 req.checkBody('email', 'Email is not valid').isEmail();
	 req.checkBody('username', 'Username is required').notEmpty();
	 req.checkBody('password', 'Password is required').notEmpty();
	 req.checkBody('password2', 'Passwords do not match!').equals(req.body.password);


	 var errors = req.validationErrors();

	 if(errors){
		 res.render('register',{
			 errors:errors
		 });
	 } else {
		 var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
     })
     User.createUser(newUser, function(err, user){
          if(err) throw err;
          console.log(user);
     });
    req.flash('success_msg', 'You are registered!  You can now login.');
    res.redirect('/users/login');
	 }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
    });
  }));

app.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');

  });

module.exports = router;
