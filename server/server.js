var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var app = express();
//var morgan = require('morgan');
var socket = require('socket.io')(); 

app.set('view engine', 'ejs');
app.set('socket', socket);

// use morgan to log requests to the console
//app.use(morgan('dev'));

app.use(express.static(getPath('public')));
app.use(require('./routes/index'));
app.use(require('./routes/random'));
app.use(function (req, res, next) {
    res.status(404).send("<p>This page doesn't exist</p><a href=\"/\">return to home</a>");
})

var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("App listening at http://%s:%s", host, port);
});

socket.attach(server);

socket.on('connection', function(connection) {
    connection.on('changePage', function(data) {
        socket.emit('newPage', data);
    });
});

function getPath(p) {
    return path.join(__dirname, '../' + p);
}