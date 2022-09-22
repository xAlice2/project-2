const express = require('express');
const router = express.Router();
const db = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');
const task = require('../models/task');

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
      res.render('todo', { todo: {
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






module.exports = router;