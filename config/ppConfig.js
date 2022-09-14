// import passport + passport-local + database into ppconfig.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Database
const db = require('../models');


// create a new instance of a LocalStrategy

const STRATEGY = new LocalStrategy({
    usernameField: 'email',         // looks for an email field as the username
    passwordField: 'password'       // looks for an password field as the password
    }, async (email, password, cb) => {
        try {
            const user = await db.user.findOne({        // wait for db.user to find the user by email
                where: { email }
            });

            if (!user || !user.validPassword(password)) {   //if user does not exist or password is false
                cb(null, false);     // callback, if no user or invalid password, return false
            } else {
                cb(null, user);     // else return user
            }
        } catch (err) {
            console.log('------- Error below -----------');
            console.log(err);
        }
})

/**
 * Serialize User with Passport in order to login
==================================================*/ 

// Passport "serialize" info to be able to login
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

/**
 * Deserialize user and return user if found by id
==================================================*/ 
passport.deserializeUser(async (id, cb) => {
    try {
        const user = await db.user.findByPk(id);    // does not work if const db = require('../models'); was not added in line 7

        if (user) {
            cb(null, user)
        }
    } catch (err) {
        console.log('---- Yo... There is an error ----');
        console.log(err);
    }
});

/**
 * Use new instance of LocalStrategy inside of Passport as middleware
==================================================*/
passport.use(STRATEGY);


/**
 * Export passport from ppConfig.js
==================================================*/

module.exports = passport;