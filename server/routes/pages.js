var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var dateFormat = require('dateformat');

router.route('/home')
    .post(function (req, res) {
        res.send("Temporary Home page");
    });

router.route('/random1')
    .post(function (req, res) {
        res.send("Hi Elena");
    });

router.route('/random2')
    .post(function (req, res) {
        res.send("How're you little spaz?");
    });

router.route('/random3')
    .post(function (req, res) {
        res.send("Random3");
    });

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
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=c0o5k11fbc01q37b085kens8ju3p2lom%40import.calendar.google.com&amp;color=%2323164E&amp;src=lh6rbkc5mmchli5qehorh3c0cn6kbum8%40import.calendar.google.com&amp;color=%23875509&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

router.route('/calendar-agenda')
    .post(function(req, res) {
        res.send('<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;mode=AGENDA&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=crschriever%40gmail.com&amp;color=%2329527A&amp;src=c0o5k11fbc01q37b085kens8ju3p2lom%40import.calendar.google.com&amp;color=%2323164E&amp;src=en.usa%23holiday%40group.v.calendar.google.com&amp;color=%2329527A&amp;ctz=America%2FNew_York" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>');
    });

router.route('/weather')
    .post(function(req, res) {
        res.redirect('/weather/Fernandina Beach');
    });

router.route('/weather/:city')
    .post(function(req, res) {

        let timeOffset = req.body.timeOffset / 60;
        console.log(timeOffset);
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
                    date: new Date(new Date().toString() + ' UTC-' + timeOffset),
                    cityName: day.name,
                    icon: day.weather[0].icon,
                    temperature: (((9 / 5)  * day.main.temp) - 459.67).toFixed(1) + ' °F',
                    main: day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1),
                    hours: []
                };

                for (let i = 0; i < 5; i++) {
                    let cHour = hourly.list[i];
                    weather.hours[i] = {
                        date: dateFormat(new Date(cHour.dt_txt + ' UTC-' + 4), 'ddd mmm d, h TT'),
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

            if (error && !responded) {
                responded = true;
                res.json({"error": error});
            } else {
                done(JSON.parse(body));
            }
        });

        request('http://api.openweathermap.org/data/2.5/forecast?q=' + req.params.city + ',us&APPID=6e81c08216ea10e956e2447bfefba7a7', function (error, response, body) {

            if (error && !responded) {
                responded = true;
                res.json({"error": error});
            } else {
                done(null, JSON.parse(body));
            }
        });
    });

module.exports = router;