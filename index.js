require('dotenv').config();
var express = require('express');
var flash = require('connect-flash');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
// var bower = require('./bower_components/bootstrap-social');

var app = express();

//// Use/Set
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
// app.use(bower);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

///Routes


app.get('/', function(req, res) {
    res.render('homepage');
});

app.get('/select', function(req, res) {
    res.render('select');
});

app.get('/auth/myaccount', isLoggedIn, function(req, res) {
    res.render('myaccount');
});


app.use('/auth', require('./controllers/auth'));

app.listen(3000);
