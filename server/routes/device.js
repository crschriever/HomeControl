var express = require('express');
var router = express.Router();

var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var deviceManager = require('../setup/deviceManager');

router.route('/')
    .get(isLoggedIn, function(req, res) {
        res.render('main/device', {
            pageId: "Device",
            pageTitle: "Register This Device",
            pageDescription: "Home Control's viewing page.",
            pageCss: ['main'],
            pageScripts: ['device'],
            useBootstrap: true,
            csrfToken: req.csrfToken()
        });
    });

router.route('/register')
    .post(function(req, res) {
        let deviceName = req.body.deviceName;
        let device = deviceManager.addDevice(deviceName);
        res.json({
            deviceName: device.name
        });
    });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

module.exports = router;