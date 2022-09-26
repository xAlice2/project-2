const express = require('express');
const router = express.Router();
const db = require('../models');

/**
 * Import the ppConfig.js file inside of auth.js located in the controllers folder
 */
const passport = require('../config/ppConfig');

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});


/**
 * The purpose of this route is to log the user out of the app. The main part of this route will be a built in function
 *  provided by request ( req ) that would do this: req.logout(). Then we will display a flash message to the user 
 * letting them know that they logged out. Lastly, we will direct the user back to the home page ( / ) like the majority
 *  of apps do after logging out.
======================================================================================================================= */

// Create /logout route to log user out
router.get('/logout', (req, res) => {
  req.logOut(() => {
    console.log('I am logged out')
  }); // logs the user out of the session
  req.flash('success', 'Logging out... See you next time!');
  res.redirect('/');
});



// this route posts to /auth/login in login.ejs
router.post('/login', passport.authenticate('local', {  //telling passport.auth to use the local authentication type
  successRedirect: '/main',         // pass :id to main
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back ...',
  failureFlash: 'Either email or password is incorrect' 
}));

/**
 * We need now to make a /POST route for the data that get submitted with the signup form. 
 * The action in the fom specifies the route that needs to be made for the data to go to. 
 * The data that is submitted will be used to create a new user and added to the database. 
 * After signing up user, we will redirect them back to the login page to login.
 */

router.post('/signup', async (req, res) => {
  // we now have access to the user info (req.body);
  const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object
  try {
    const [user, created] = await db.user.findOrCreate({
        where: { email },
        defaults: { name, password }
    });

    if (created) {
        // if created, success and we will redirect back to / page
        console.log(`----- ${user.name} was created -----`);
        const successObject = {
            successRedirect: '/main',
            successFlash: `Welcome ${user.name}. Account was created and logging in...`
        }
        // 
        passport.authenticate('local', successObject)(req, res);
    } else {
      // Send back email already exists
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup'); // redirect the user back to sign up page to try again
    }
  } catch (error) {
        // There was an error that came back; therefore, we just have the user try again
        console.log('**************Error');
        console.log(error);
        req.flash('error', 'Either email or password is incorrect. Please try again.');
        res.redirect('/auth/signup');
  }
});

module.exports = router;