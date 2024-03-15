var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

if (process.env.MONGODB_URL){
    var mongoDB = process.env.MONGODB_URL;
}
else{
    var mongoDB = 'mongodb://localhost:27017/Probum';
}

// Connection to the mongo database
var mongoose = require('mongoose');

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.on('open', function() { console.log("Connected to MongoDB successfuly...") })

var indexRouter = require('./routes/index');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
