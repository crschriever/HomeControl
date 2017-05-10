var path = require('path');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var io = require('socket.io')();
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

// configure passport
require(getPath('server/setup/passport'));

// Add default users if there aren't any and we are in development
if (dev) {
    addDefaultUsers();
}

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
app.use(require('./routes/index'));
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

// Server sockets
io.attach(server);

io.on('connection', function(socket) {

    socket.on('joinRoom', function(data) {
        socket.userRoom = data.userID;
        socket.join(data.userID);
    });

    console.log(io.sockets.adapter.rooms);

    socket.on('changePage', function(data) {
        io.to(socket.userRoom).emit('newPage', data);
    });
});

function getPath(file) {
    return path.join(__dirname, '../' + file);
}

function addDefaultUsers() {
    // TODO
}