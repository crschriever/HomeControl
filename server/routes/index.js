var express = require('express');
var router = express.Router();
var path = require('path')

router.route('/')
    .get(function (req, res) {
        res.render('index', {
            pageId: "Home",
            pageTitle: "Home Control",
            pageDescription: "Home Control's landing page.",
            pageCss: ['main'],
            pageScripts: ['dummyScript'],
            useBootstrap: true
        });
    });

router.route('/switcher')
    .get(function (req, res) {
        res.render('switcher', {
            pageId: "Switcher",
            pageTitle: "Home Control Switcher",
            pageDescription: "Home Control's switcher page.",
            pageCss: ['main'],
            pageScripts: ['switcher'],
            useBootstrap: true,
            useSocket: true
        });
    });

router.route('/viewer')
    .get(function (req, res) {
        res.render('viewer', {
            pageId: "Viewer",
            pageTitle: "Home Control",
            pageDescription: "Home Control's viewing page.",
            pageCss: ['main'],
            pageScripts: ['viewer'],
            useBootstrap: true,
            useSocket: true
        });
    });

module.exports = router;