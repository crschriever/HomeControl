var express = require('express');
var router = express.Router();
var path = require('path');

router.route('/home')
    .get(function (req, res) {
        res.send("Temporary Home page");
    });

router.route('/random1')
    .get(function (req, res) {
        res.send("Hi Elena");
    });

router.route('/random2')
    .get(function (req, res) {
        res.send("How're you little spaz?");
    });

router.route('/random3')
    .get(function (req, res) {
        res.send("Random3");
    });

router.route('/clock')
    .get(function (req, res) {
        res.render('main/clock', {
            pageId: "Clock",
            pageTitle: "Clock",
            pageDescription: "Home Control's clock page.",
            pageCss: ['main'],
            pageScripts: ['clock', 'weather'],
            useBootstrap: true,
        });
    });

module.exports = router;