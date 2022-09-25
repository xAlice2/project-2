const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const task = require('../models/task');
const { route } = require('./auth');

router.get('/', isLoggedIn, (req, res) => {
    console.log('test')
    db.todo.findOne({
      where: { userId: req.user.id },
        order: [[ 'createdAt', 'DESC']],    //sorts by created  DESC
      include: [ 
        { model: db.taskDetails, include:[db.task] }, 
        db.note 
        ]  //passes the models from the association
    }).then((todo) => {

      console.log('todos: ' + todo)
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
    updatedAt: createdDate
  })
  .then(task => {
    res.redirect('/todo');
  })
  .catch(error => {
    console.log('==========================post error ==========================')
    console.log(error)
    console.log('==========================post error ==========================')
  })

})

router.post('/', isLoggedIn, (req, res) => {
  const createdDate = new Date().toISOString();
  console.log(req.body)
  db.task.create({
    title: req.body.title,
    createdAt: createdDate,
    updatedAt: createdDate
  })
  .then(task => {
    res.redirect('/todo');
  })
  .catch(error => {
    console.log('==========================post error ==========================')
    console.log(error)
    console.log('==========================post error ==========================')
  })
})




module.exports = router;