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

router.route('/calendar-month')
    .get(function(req, res) {
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=1&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=c0o5k11fbc01q37b085kens8ju3p2lom%40import.calendar.google.com&amp;color=%2323164E&amp;src=lh6rbkc5mmchli5qehorh3c0cn6kbum8%40import.calendar.google.com&amp;color=%23875509&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

router.route('/calendar-agenda')
    .get(function(req, res) {
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=c0o5k11fbc01q37b085kens8ju3p2lom%40import.calendar.google.com&amp;color=%2323164E&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

module.exports = router;