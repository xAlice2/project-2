//IMPORTS
require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');  //allows us to use passports in our pp application
const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');
const axios = require('axios');
const path = require('path');
const methodOverride = require('method-override') 

const SECRET_SESSION = process.env.SECRET_SESSION;
console.log('server.js console.log >>>>>', SECRET_SESSION);


// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(methodOverride('__method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.use(layouts);

app.set('layout', './layouts/nav-layout')
app.set('layout', './layouts/nonav-layout')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));


app.use(flash());            // invoke flash middleware

/**
 *  Initialize passport and passport session, invoke it, and pass through as middleware. 
 *  Place this between the middleware that invokes flash and the middleware that is using res.locals
 ======================================================================================*/
app.use(passport.initialize());      // Initialize passport
app.use(passport.session());         // Add a session


 // before it goes to home route, this function will run every single time
app.use((req, res, next) => { // next allows us to do whatever the next thing is
  console.log('console log for res.locals in server.js', res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});




app.get('/', (req, res) => {
  res.render('main/index');
})

// app.get('/', (req, res) => {
//   res.render('main/index', { layout: './layouts/nonav-layout'});
// })

// access to all of our auth routes GET /auth/login, GET /auth/signup POST routes
app.use('/auth', require('./routes/auth'));
app.use('/todo', require('./routes/todo'));




/**
 *  ISLOGGEDIN
 *      ./views/PAGES/
 *            contains pages only viewable after user is logged in
 * Remember to add isLoggedIn once done testing:
 * app.get('/main', isLoggedIn, (req, res) => {
 ===================================================================== */

app.get('/main', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('views/pages/main', { id, name, email });
});

app.get('/profile', (req, res) => {
  // const { id, name, email } = req.user.get(); 
  res.render('pages/profile', { id: 1, name: 'test1', email:'test2@test.com' });
});

app.get('/signup', (req, res) => {
  res.render('main/index', { layout: './layouts/nonav-layout'});
})


// app.get('/articles', isLoggedIn, (req, res) => {
//   res.render('views/pages/articles', {
//   })
// })




const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
