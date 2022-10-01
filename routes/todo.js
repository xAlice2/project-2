const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const task = require('../models/task');
const { route } = require('./auth');

router.get('/', isLoggedIn, (req, res) => {
    console.log('request body ------ ', req.body)
    console.log('test')
    db.todo.findOne({
      where: { userId: req.user.id },
        // order: [[ 'createdAt', 'DESC']],    //sorts by created  DESC
      include: [ 
        { model: db.taskDetails, include:[db.task] }, 
        db.note 
        ]  //passes the models from the association
    }).then((todo) => {

      console.log('todos: ' + JSON.stringify(todo))
      res.render('partials/todo', { todo: {
        notes: todo.notes,
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
})


router.get('/create', isLoggedIn, (req, res) => {
  console.log('test')
  db.task.findAll().then((tasks) => {

    console.log('tasks: ' + tasks)

    if(tasks && Array.isArray(tasks) && tasks.length > 0) {
      res.render('pages/createTodo', {tasks})
    } else {
      throw new Error();
    }
  }).catch((error) => {
    console.log('error: ' + error)
  })
})

router.post('/task', isLoggedIn, (req, res) => {
  const createdDate = new Date().toISOString();
  db.task.create({
    title: req.body.title,
    createdAt: createdDate,
    updatedAt: createdDate,
  }).then((task) => {

    db.todo.findOne({
      where: { userId: req.user.id }
    }).then((todo) => {

      db.taskDetails.create({
        todoId: parseInt(todo.id),
        taskId: parseInt(task.id),
        complete: false,
        createdAt: createdDate,
        updatedAt: createdDate,
      })

    })

  })
  .then(task => {
    console.log('======================= task ', JSON.stringify(task))
    res.redirect('/main');
  })
  .catch(error => {
    console.log('==========================post error ==========================')
    console.log(error)
    console.log('==========================post error ==========================')
  })
})

  // PUT request to update taskDetails entry to completed or uncompleted
  router.post('/task/:id', isLoggedIn, (req, res) => {
    const { complete } = req.body; // retrieve checkbox input type with name - "complete" line 12 in todo.ejs
    const { id } = req.params; // retrieve task id from query param

    console.log(" ---------------------------------------------");

    const updateDate = new Date().toISOString();

    console.log(" @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");


    // find our corresponding todo data attached to our user
    // so we can use the todo ID value to update our taskDetails entry
    db.todo.findOne({
      where: { userId: req.user.id }
    }).then((todo) => {
      /*
        * after getting our todo data result, we can now use that todoId to ensure we update the correct taskDetails entry
        * https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-update-queries
        *
        */
      if (complete === undefined) {
        console.log(" false ")
        db.taskDetails.update({
          complete: false, updatedAt: updateDate
        }, {
          where: {
            todoId: todo.id,
            taskId: parseInt(id),
          }
        })
      } else {
        console.log(" true ")
        db.taskDetails.update({
          complete: true, updatedAt: updateDate
        }, {
          where: {
            todoId: todo.id,
            taskId: parseInt(id),
          }
        })
      }
    })
    .then(() => {
      res.redirect('/main')
    })
    .catch(error => {
      console.log('==========================post error ==========================')
      console.log(error)
      console.log('==========================post error ==========================')
    })
  })


module.exports = router;
