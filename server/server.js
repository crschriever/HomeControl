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

// Use config file for nconf
nconf.file(getPath('server/config.json'));

// Development or deployed
var dev = nconf.get('env') === 'dev'; 

// Setup Mongoose
mongoose.connect('localhost:27017/HomeControl');

// Add default users if there aren't any and we are in development
if (dev) {
    addDefaultUsers();
}

app.set('view engine', 'ejs');
app.set('views', 'server/views');

// use morgan to log requests to the console
// app.use(morgan('dev'));

app.use(express.static(getPath('public')));
app.use(require('./routes/index'));
app.use(require('./routes/login'));
app.use(require('./routes/pages'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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

var port = nconf.get("http:port");
var server = app.listen(port || 3000, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("App listening at http://%s:%s", host, port);
});

io.attach(server);

io.on('connection', function(socket) {
    console.log("Connection");
    socket.on('changePage', function(data) {
        console.log("Change"); 
        io.emit('newPage', data);
    });
});

function getPath(file) {
    return path.join(__dirname, '../' + file);
}

function addDefaultUsers() {
    // TODO
}