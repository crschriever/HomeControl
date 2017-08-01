var path = require('path');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require(getPath('server/websocket/socket.js'));
var morgan = require('morgan');
var nconf = require('nconf');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

// Use config file for nconf
nconf.file(getPath('server/config.json'));

// Development or deployed
var dev = nconf.get('env') === 'dev'; 

// Setup Mongoose
mongoose.Promise = require('bluebird');
mongoose.connect('localhost:27017/HomeControl');

if (dev) { // Add data for Lists
    var ListGroup = require(getPath('server/models/todo'));

    ListGroup.find({}, function(err, results) {
        if (results.length <= 0 || (results.length == 1 && results[0].groups.length <= 0)) {
            ListGroup.remove({}, function(err, results){
                var groupOne = new ListGroup({
                    name: "Example",
                    groups: [
                        {
                            title: "Title one baby",
                            items:[
                                {text: "ubleq", checked: false},
                                {text: "Who nkows", checked: false},
                                {text: "But Why>", checked: true}
                            ]
                        },
                        {
                            title: "Title two baby",
                            items:[
                                {text: "ubleq", checked: false},
                                {text: "But Why>", checked: true}
                            ]
                        }
                    ]
                });
                groupOne.save();
            });
        }
    });
}

// configure passport
require(getPath('server/setup/passport'));

// Set socket url for socket.io to use in scripts
app.locals.socketTarget = nconf.get('http:url') || 'localhost:3000';

app.set('view engine', 'ejs');
app.set('views', 'server/views');

// use morgan to log requests to the console if developing
if (dev) {
    app.use(morgan('dev'));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
var secret = nconf.get('session:secret');
if (!secret || secret.length === 0) {
    console.error("Secret was not included in config.json");
}
app.use(session({
    secret: secret || "Super Secret Secret: No guessing mkay",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {maxAge: 10 * 24 * 60 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set up routes and static files
app.use(express.static(getPath('public')));
app.use('/user', require('./routes/login'));
app.use(require('./routes/index')(io.changePage).router);
app.use(require('./routes/pages'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = nconf.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Starts server
var port = nconf.get("http:port");
var server = app.listen(port || 3000, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("App listening at http://%s:%s", host, port);
});

// Attach server socket
io.attach(server);

function getPath(file) {
    return path.join(__dirname, '../' + file);
}