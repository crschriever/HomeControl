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

module.exports = router;