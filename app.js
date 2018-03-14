var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();

var mongoose = require("mongoose");

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/ecom_nodejs");

//create collections and register models
fs.readdirSync(path.join(__dirname,"models")).forEach(function (filename) {
    require("./models/"+filename);
    console.log( filename );
});


var session = require("express-session");

// request.session
app.use(session({
  secret:"!@#$#@%#$^%!@#$%" ,
  cookie:{maxAge: 60 * 60 * 24 * 7 * 1000 }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//routes
var index = require('./controllers/index');
var users = require('./controllers/users');
var products = require('./controllers/products');

//main routes
app.use('/', index);
app.use('/users', users);
app.use('/products',products);


//This 2 middlewares must be last section in app.js as if request doesn't handle they will catch it
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//start listenning
app.listen(80);
