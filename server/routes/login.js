var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

router.route('/user/signup')
    .get(function (req, res) {
        res.render('user/signup', {
            pageId: "Signup",
            pageTitle: "Sign up",
            pageDescription: "Home Control's sign up page.",
            pageCss: ['main'],
            pageScripts: [],
            useBootstrap: true,
        });
    });

router.route('/user/login')
    .get(function (req, res) {
        res.render('user/login', {
            pageId: "Login",
            pageTitle: "Log in",
            pageDescription: "Home Control's log in page.",
            pageCss: ['main'],
            pageScripts: [],
            useBootstrap: true,
        });
    });

module.exports = router;