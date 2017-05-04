var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var database = require('../models');
var facebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, callback) {
    callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
    database.user.findById(id).then(function(user) {
        callback(null, user);
    }).catch(callback);
});

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, callback) {
    database.user.findOne({
        where: { email: email }
    }).then(function(user) {
        if (!user || !user.isValidPassword(password)) {
            callback(null, false); //No user or bad password
        } else {
            callback(null, user); //User is allowed
        }
    }).catch(callback);
}));

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL = '/auth/callback/facebook',
    profileFields: ['id', 'email', 'displayName'],
    enableProof: true
}, function(accessToken, refreshToken, profile, callback) {
    ///see if we can get the email from the fb profile
    var email = profile.emails ? profile.emails[0].value : null;

    ///see if user already exists in database
    database.user.findOne({
            where: { email: email }
        })
        .then(function(existingUser) {
            //user already exists
            if (existingUser && email) {
                existingUser.updateAttributes({
                    facebookId: profile.id,
                    facebookToken: accessToken
                }).then(function(updatedUser) {
                    callback(null, updatedUser);
                }).catch(callback);
            } else {
                ///new user
                database.user.findOrCreate({
                    where: { facebookId: profile.id },
                    defaults: {
                        facebookToken: accessToken,
                        email: email,
                        firstName: profile.displayName.split(' ')[0],
                        lastName: profile.displayName.split(' ')[1]
                    }
                }).spread(function(user, wasCreated) {
                    if (wasCreated) {
                        ///new user, created account
                        callback(null, user);
                    } else {
                        ///not new user, just update token
                        user.facebookToken = accessToken;
                        user.save().then(function() {
                            callback(null, user);
                        }).catch(callback);
                    }
                }).catch(callback);
            }
        });
}));


module.exports = passport;
