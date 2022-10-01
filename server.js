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
const methodOverride = require('method-override'); 
const todo = require('./models/todo');
const bodyparser = require('body-parser');

const SECRET_SESSION = process.env.SECRET_SESSION;
console.log('server.js console.log >>>>>', SECRET_SESSION);


// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(methodOverride('__method'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
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
 *  ===================================================================== */

// app.get('/pagename', isLoggedIn, (req, res) => {
//   const { id, name, email } = req.user.get(); 
//   res.render('views/pages/main', { id, name, email });
// });

app.get('/main', isLoggedIn, (req, res) => {
  db.todo.findOne({
    where: { userId: req.user.id },
      // order: [[ 'createdAt', 'DESC']],    //sorts by created  DESC
    include: [ 
      { model: db.taskDetails, include:[db.task] }, 
      db.note 
      ]  //passes the models from the association
  }).then((todo) => {

    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    console.log('todos: ' + JSON.stringify(todo))
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    res.render('pages/main', { todo: {
      // notes: todo.notes,
      tasks: todo.taskDetails.map((taskDetail) =>{
          return {
              complete: taskDetail.complete,
              title: taskDetail.task.title,
              id: taskDetail.taskId
          }
      })
    } })
  }).catch((error) => {
    console.log('error: ' + error)
  })
});


 app.get('/main/:id', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  db.todo.findOne({
    where: { userId: req.params.id },  
    include: [ 
      { model: db.taskDetails, include:[db.task] }, 
      // db.note 
      ]  //passes the models from the association
  }).then((todo) => {

    console.log('todos: ' + JSON.stringify(todo))
    res.render('pages/main', { id, name, email, todo: {
      // notes: todo.notes,
      tasks: todo.taskDetails.map((taskDetail) =>{
          return { 
              complete: taskDetail.complete,
              title: taskDetail.task.title,
              id: taskDetail.id
          }
      })
    } })
  }).catch((error) => {
    console.log('error: ' + error)
  })
  res.render('pages/main', { id, name, email }, );
});

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('pages/profile', { id, name, email });
});

app.get('/todo', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('partials/todo', { id, name, email });
});

app.get('/pomodoro', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('partials/pomo/pomodoro', { id, name, email });
});

app.get('/createtodo', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('pages/createTodo', { id, name, email });
});

app.get('/signup', (req, res) => {
  res.render('auth/signup', { layout: './layouts/nonav-layout'});
})


app.get('/pomodoro', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('partials/pomodoro', { id, name, email });
});




/**
 *  Bypass Login (for testing purposes)
 * 
 ===================================================================== */
//  app.get('/main', isLoggedIn, (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   db.todo.findOne({
//     where: { userId: req.user.id },
//       order: [[ 'createdAt', 'DESC']],    //sorts by created  DESC
//     include: [ 
//       { model: db.taskDetails, include:[db.task] }, 
//       db.note 
//       ]  //passes the models from the association
//   }).then((todo) => {

//     console.log('todos: ' + JSON.stringify(todo))
//     res.render('pages/main', { id: 1, name: 'test1', email:'test2@test.com', todo: {
//       notes: todo.notes,
//       tasks: todo.taskDetails.map((taskDetail) =>{
//           return { 
//               complete: taskDetail.complete,
//               title: taskDetail.task.title,
//               id: taskDetail.id
//           }
//       })
//     } })
//   }).catch((error) => {
//     console.log('error: ' + error)
//   })
//   // res.render('pages/main', { id: 1, name: 'test1', email:'test2@test.com' }, );
// });


//  app.get('/main/:id', (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   db.todo.findOne({
//     where: { userId: req.params.id },  
//     include: [ 
//       { model: db.taskDetails, include:[db.task] }, 
//       db.note 
//       ]  //passes the models from the association
//   }).then((todo) => {

//     console.log('todos: ' + JSON.stringify(todo))
//     res.render('pages/main', { id: 1, name: 'test1', email:'test2@test.com', todo: {
//       notes: todo.notes,
//       tasks: todo.taskDetails.map((taskDetail) =>{
//           return { 
//               complete: taskDetail.complete,
//               title: taskDetail.task.title,
//               id: taskDetail.id
//           }
//       })
//     } })
//   }).catch((error) => {
//     console.log('error: ' + error)
//   })
//   // res.render('pages/main', { id: 1, name: 'test1', email:'test2@test.com' }, );
// });

// app.get('/profile', (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   res.render('pages/profile', { id: 1, name: 'test1', email:'test2@test.com' });
// });

// app.get('/todo', (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   res.render('partials/todo', { id: 1, name: 'test1', email:'test2@test.com' });
// });

// app.get('/createtodo', (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   res.render('pages/createTodo', { id: 1, name: 'test1', email:'test2@test.com' });
// });

// app.get('/signup', (req, res) => {
//   res.render('auth/signup', { layout: './layouts/nonav-layout'});
// })


// app.get('/pomodoro', (req, res) => {
//   // const { id, name, email } = req.user.get(); 
//   res.render('partials/pomodoro', { id: 1, name: 'test1', email:'test2@test.com' });
// });



/**
 *  404 
 * 
 ===================================================================== */

app.use((req, res) => {
  res.status(404).render('main/404', { layout: './layouts/nav-layout'});
})



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
