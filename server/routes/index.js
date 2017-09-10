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

        if (!req.cookies.deviceName) {
            res.redirect('/device');
        }

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
        
        if (!req.cookies.deviceName) {
            res.redirect('/device');
            return;
        }

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
    let action = req.body.result.action;
    
    // Show page intent
    if (action === 'show_page') {
        let page = req.body.result.parameters.page;
        let devices = req.body.result.parameters.devices;
        indexRoute.changePage(page, devices);
        let speech = "Showing " + page;
        if (devices.length != 0) {
            speech +=  listDevices(devices);
        }
        res.json({
            "speech": speech,
            "displayText": speech,
            "source": "home.carlschriever.com",
            "data": {
                "google": {
                    "expect_user_response": false,
                }
            }
        });
    } else if (action === 'show_weather') {
        let devices = req.body.result.parameters.devices;
        let location = req.body.result.parameters.location || 'Atlanta';
        indexRoute.changePage('weather/' + location);
        let speech = "Showing weather for" + location;
        if (devices) {
            speech += listDevices(devices);
        }
        res.json({
            "speech": speech,
            "displayText": speech,
            "source": "home.carlschriever.com",
            "data": {
                "google": {
                    "expect_user_response": false,
                }
            }
        });
    } else if (action === 'activate_button') {
        let button = req.body.result.parameters.button_id;
        res.json({
            "speech": "Pressing " + button,
            "displayText": "Pressing " + button,
            "source": "home.carlschriever.com",
            "data": {
                "google": {
                    "expect_user_response": false,
                }
            }
        });
    } else if (action === 'show_cheat_sheet') {
        let page = 'cheatsheet/' + req.body.result.parameters.cheatsheet;
        let devices = req.body.result.parameters.devices;
        indexRoute.changePage(page, devices);
        let speech = "Showing " + page;
        if (devices) {
            speech += listDevices(devices);
        }
        res.json({
            "speech": speech,
            "displayText": speech,
            "source": "home.carlschriever.com",
            "data": {
                "google": {
                    "expect_user_response": false,
                }
            }
        });
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

function listDevices(devices) {
    let speech = " on ";
    devices.forEach(function(device, index) {
        if (index == 0) {
            speech += " " + device;
        } else if (index === devices.length - 1 && devices.length !== 1) {
            speech += ", and " + device;
        } else {
            speech += ", " + device;
        }
    });
    return speech;
}

module.exports = function(changePage) {
    indexRoute.changePage = changePage;

    return indexRoute;
};