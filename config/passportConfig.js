var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models');
var facebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: { email: email }
    }).then(function(user) {
        if (!user || !user.isValidPassword(password)) {
            cb(null, false); //No user or bad password
        } else {
            cb(null, user); //User is allowed, yay
        }
    }).catch(cb);
}));

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL = '/auth/callback/facebook',
    profileFields: ['id', 'email', 'displayName'],
    enableProof: true
}, function(accessToken, refreshToken, profile, cb) {
    ///see if we can get the email from the fb profile
    var email = profile.emails ? profile.emails[0].value : null;

    ///see if user already exists in database
    db.userfindOne({
            where: { email: email }
        })
        .then(function(existingUser) {
            //user already exists
            if (existingUser && email) {
                existingUser.updateAttributes({
                    facebookId: profile.id,
                    facebookToken: accessToken
                }).then(function(updatedUser) {
                    cb(null, updatedUser);
                }).catch(cb);
            } else {
                ///new user
                db.user.findOrCreate({
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
                        cb(null, user);
                    } else {
                        ///not new user, just update token
                        user.facebookToken = accessToken;
                        user.save().then(function() {
                            cb(null, user);
                        }).catch(cb);
                    }
                }).catch(cb);
            }
        });
}));


module.exports = passport;
