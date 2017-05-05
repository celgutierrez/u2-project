var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login');
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/myaccount',
    successFlash: 'Logging in...',
    failureRedirect: '/auth/login',
    failureFlash: 'Login failed, try again'
}));


router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstname': req.body.firstName,
            'lastname': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            passport.authenticate('local', {
                successRedirect: '/auth/subscribe',
                successFlash: 'Welcome to BeeHelpful!',
                failureRedirect: '/auth/login',
                failureFlash: 'There was an error logging in, please re-try!'
            })(req, res, next);

        } else {
            req.flash('error', 'Email already exists in our system, please log in.');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        console.log('error', error.message);
        res.redirect('/auth/signup');
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out of your account');
    res.redirect('/');
});

///FACEBOOK AUTH

/// sends request
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

/// receiving feedback
router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/auth/myaccount',
    successFlash: 'You have logged in with Facebook.',
    failureRedirect: '/auth/login',
    failureFlash: 'Unable to login using Facebook.'
}));


//Export
module.exports = router;
