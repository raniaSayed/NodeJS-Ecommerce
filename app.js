var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var app = express();

var mongoose = require("mongoose");

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/contact_list");

//create collections and register models
fs.readdirSync(path.join(__dirname,"models")).forEach(function (filename) {
    require("./models/"+filename);
});

app.use(bodyParser.json());

var contacts = require('./controllers/contacts');

app.use('/contacts',contacts);


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

  // return error message
  res.status(err.status || 500);
  res.json({message: res.locals.message,error:res.locals.error});
});


//start listenning
app.listen(9090);
