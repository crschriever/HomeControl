var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// passport config
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // Validate email and password
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    if (errors) {
        return done(null, false, {message: errors[0].msg});
    }

    User.findOne({'email': email}, function(err, user) {
        // Return error if there is one
        if (err) {
            return done(err);
        }
        // If the user already exists return a message
        if (user) {
            return done(null, false, {message: 'Email is already being used.'});
        }
        // Create new user and store email / encrypted password
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // Validate email and password
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid Password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return done(null, false, {message: errors[0].msg});
    }
    
    User.findOne({'email': email}, function(err, user) {
        // Return error if there is one
        if (err) {
            return done(err);
        }

        // If the user is not found
        if (!user) {
            return done(null, false, {message: 'User account with that email does not exist.'});
        }

        // If the password is incorrect
        if (!user.validatePassword(password)) {
            return done(null, false, {message: 'Incorrect password for that email.'})
        }

        return done(null, user);
    });
}));