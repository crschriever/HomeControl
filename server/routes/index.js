var express = require('express');
var router = express.Router();
var path = require('path')

// This is returned as the module
var indexRoute = {
    changePage: null,
    router: router
}

router.route('/')
    .get(function (req, res) {
        res.render('main/index', {
            pageId: "Home",
            pageTitle: "Home Control",
            pageDescription: "Home Control's landing page.",
            pageCss: ['main'],
            pageScripts: ['dummyScript'],
            useBootstrap: true
        });
    });

router.route('/switcher')
    .get(isLoggedIn, function (req, res) {
        res.render('main/switcher', {
            pageId: "Switcher",
            pageTitle: "Home Control Switcher",
            pageDescription: "Home Control's switcher page.",
            pageCss: ['main'],
            pageScripts: ['switcher'],
            useBootstrap: true,
            useSocket: true,
            userID: req.session.passport.user
        });
    });

router.route('/viewer')
    .get(isLoggedIn, function (req, res) {
        res.render('main/viewer', {
            pageId: "Viewer",
            pageTitle: "Home Control",
            pageDescription: "Home Control's viewing page.",
            pageCss: ['main'],
            pageScripts: ['viewer'],
            useBootstrap: true,
            useSocket: true,
            userID: req.session.passport.user
        });
    });

router.post('/switch', function(req, res) {
    let page = req.body.result.parameters.page;
    indexRoute.changePage(page);
    res.json({
        "speech": "Showing " + page,
        "speech": "Showing " + page,        
        "data": {},
        "contextOut": [],
        "expectUserResponse": false,
        "source": "Home.CarlSchriever.com"
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

module.exports = function(changePage) {
    indexRoute.changePage = changePage;

    return indexRoute;
};