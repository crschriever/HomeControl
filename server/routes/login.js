var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.route('/signup')
    .get(function(req, res) {
        res.render('user/signup', {
            pageId: "Signup",
            pageTitle: "Sign up",
            pageDescription: "Home Control's sign up page.",
            pageCss: ['main'],
            pageScripts: [],
            useBootstrap: true,
            csrfToken: req.csrfToken(),
            error: req.flash('error')
        })
    }).post(passport.authenticate('local.signup', {
        successRedirect: '/viewer',
        failureRedirect:'/user/signup',
        failureFlash: true
    }));

router.route('/login')
    .get(function (req, res) {
        res.render('user/login', {
            pageId: "Login",
            pageTitle: "Log in",
            pageDescription: "Home Control's log in page.",
            pageCss: ['main'],
            pageScripts: [],
            useBootstrap: true,
            csrfToken: req.csrfToken(),
            error: req.flash('error')
        });
    }).post(passport.authenticate('local.login', {
        successRedirect: '/device',
        failureRedirect:'/user/login',
        failureFlash: true
    }));

router.route('/logout')
    .get(function(req, res) {
        req.logout();
        res.redirect('/');
    });

module.exports = router;