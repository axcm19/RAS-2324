var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var User = require('./models/user');
var cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();

// Connection to the mongo database
var mongoose = require('mongoose');

if (process.env.MONGODB_URL){
    var mongoDB = process.env.MONGODB_URL;
}
else{
    var mongoDB = 'mongodb://localhost:27017/Probum';
}

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.on('open', function() { console.log("Connected to MongoDB successfuly...") })

require('./auth/auth');

var secureRouter = require('./routes/secureRoutes');
var authRouter = require('./routes/users');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
//app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

app.use('', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), secureRouter);

module.exports = app;
