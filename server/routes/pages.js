var express = require('express');
var router = express.Router();
var path = require('path')

router.route('/random1')
    .get(function (req, res) {
        res.send("Random1")
    });

router.route('/random2')
    .get(function (req, res) {
        res.send("Random2")
    });

router.route('/random3')
    .get(function (req, res) {
        res.send("Random3")
    });

router.route('/clock')
    .get(function (req, res) {
        res.render('clock', {
            pageId: "Clock",
            pageTitle: "Clock",
            pageDescription: "Home Control's clock page.",
            pageCss: ['main'],
            pageScripts: ['clock', 'weather'],
            useBootstrap: true,
        });
    });

module.exports = router;