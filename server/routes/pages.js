var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var dateFormat = require('dateformat');

var ListGroup = require('../models/todo.js');

router.route('/clock')
    .post(function (req, res) {
        res.render('partials/content/clock', {
            pageId: "Clock",
            pageTitle: "Clock",
            pageDescription: "Home Control's clock page.",
            pageCss: ['main'],
            pageScripts: ['clock'],
            useBootstrap: true,
        });
    });

router.route('/calendar-month')
    .post(function(req, res) {
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=td6m9idu672orrk7t5liujo540qdqlm7%40import.calendar.google.com&amp;color=%23125A12&amp;src=gp2alrjlrfvu3p0mqckv6drb3g%40group.calendar.google.com&amp;color=%236B3304&amp;src=lh6rbkc5mmchli5qehorh3c0cn6kbum8%40import.calendar.google.com&amp;color=%23875509&amp;src=ncaab_232_Georgia%2BTech%2BYellow%2BJackets%23sports%40group.v.calendar.google.com&amp;color=%23AB8B00&amp;src=ncaaf_4_Georgia%2BTech%2BYellow%2BJackets%23sports%40group.v.calendar.google.com&amp;color=%23AB8B00&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

router.route('/calendar-agenda')
    .post(function(req, res) {
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=td6m9idu672orrk7t5liujo540qdqlm7%40import.calendar.google.com&amp;color=%23125A12&amp;src=gp2alrjlrfvu3p0mqckv6drb3g%40group.calendar.google.com&amp;color=%236B3304&amp;src=lh6rbkc5mmchli5qehorh3c0cn6kbum8%40import.calendar.google.com&amp;color=%23875509&amp;src=ncaab_232_Georgia%2BTech%2BYellow%2BJackets%23sports%40group.v.calendar.google.com&amp;color=%23AB8B00&amp;src=ncaaf_4_Georgia%2BTech%2BYellow%2BJackets%23sports%40group.v.calendar.google.com&amp;color=%23AB8B00&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

router.route('/weather')
    .post(function(req, res) {
        res.redirect('/weather/Fernandina Beach');
    });

router.route('/weather/:city')
    .post(function(req, res) {

        let timeOffset = req.body.timeOffset / 60;
        let day, hourly, responded = false;

        let done = function(d, h) {
            if (d) {
                day = d;
            }
            if (h) {
                hourly = h;
            }

            if (day && hourly) {

                let weather = {
                    date: new Date(new Date().toString() + ' UTC+' + timeOffset),
                    cityName: day.name,
                    icon: day.weather[0].icon,
                    temperature: (((9 / 5)  * day.main.temp) - 459.67).toFixed(1) + ' °F',
                    main: day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1),
                    hours: []
                };

                for (let i = 0; i < 5; i++) {
                    let cHour = hourly.list[i];
                    weather.hours[i] = {
                        date: dateFormat(new Date(cHour.dt_txt + ' UTC+' + timeOffset), 'ddd mmm d, h TT'),
                        min: (((9 / 5)  * cHour.main.temp_min) - 459.67).toFixed(1),
                        max: (((9 / 5)  * cHour.main.temp_max) - 459.67).toFixed(1),
                        main: cHour.weather[0].description.charAt(0).toUpperCase() + cHour.weather[0].description.slice(1),
                    }
                }

                res.render('partials/content/weather', {
                    pageId: "Weather",
                    pageTitle: "weather",
                    pageDescription: "Home Control's weather page.",
                    pageWeather: weather,
                    pageCss: ['main'],
                    pageScripts: ['weather'],
                    useBootstrap: true
                });
            }
        }

        request('http://api.openweathermap.org/data/2.5/weather?q=' + req.params.city + ',us&APPID=6e81c08216ea10e956e2447bfefba7a7', function (error, response, body) {

            console.log(error);            

            if (error && !responded) {
                responded = true;
                res.json({"error": error});
            } else if (!responded){
                done(JSON.parse(body));
            }
        });

        request('http://api.openweathermap.org/data/2.5/forecast?q=' + req.params.city + ',us&APPID=6e81c08216ea10e956e2447bfefba7a7', function (error, response, body) {

            console.log(error);

            if (error && !responded) {
                responded = true;
                res.json({"error": error});
            } else if (!responded){
                done(null, JSON.parse(body));
            }
        });
    });

router.route('/lists')
    .post(function(req, res) {
        let listNames = [];
        ListGroup.find({}, function(err, users) {
            users.forEach(function(listGroup) {
                listNames.push(listGroup.name);
            });
            res.render('partials/content/lists', {
                pageId: "Lists",
                pageTitle: "Lists",
                pageDescription: "Home Control's lists page.",
                pageCss: ['main'],
                pageScripts: ['lists'],
                useBootstrap: true,
                listSets: listNames
            });
        });
    });

router.route('/list/:name')
    .post(function(req, res) {

        ListGroup.findOne({name: req.params.name}, function(err, list) {
                        
            res.render('partials/content/list', {
                pageId: "List",
                pageTitle: "List",
                pageDescription: "Home Control's list page.",
                pageCss: ['main'],
                pageScripts: ['list'],
                useBootstrap: true,
                name: req.params.name,
                groups: list.groups
            });
        });
    });

router.route('/cheatsheet/:name')
    .post(function(req, res) {
        let sheet = req.params.name;
        res.render('partials/content/cheatsheet', {
            pageId: "Cheatsheet",
            pageTitle: "CheatSheet",
            pageDescription: "Home Control's cheat sheet page",
            pageCss: ['main'],
            pageScripts: [],
            useBootstrap: true,
            sheet,
        });
    });
 
module.exports = router;