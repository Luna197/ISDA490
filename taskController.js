// taskController.js
// Import task model
Task = require('./taskModel');
User = require('./userModel');
// Handle index actions
exports.index = function (req, res) {

    let where  = req.query.where
    let sort = req.query.sort
    let select = req.query.select
    let skip = req.query.skip
    let limit = req.query.limit
    let count = req.query.count

    if(where){where = JSON.parse(where)} else{where = {}}
    if(sort){sort = JSON.parse(sort)} else{sort = {}}
    if(select){select = JSON.parse(select)} else{select = {}}
    if(skip){skip = JSON.parse(skip)} else{skip = 0}
    if(limit){limit = JSON.parse(limit)} else{limit = 0}
    if(count){count = JSON.parse(count)} else{count = 0}

    Task.find(where).sort(sort).select(select).skip(skip).limit(limit).exec((err, tasks)=>{
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else{
            if(count == 1)
            {tasks = tasks.length}

            // res.json({
            //     status: "success",
            //     message: "Users retrieved successfully",
            //     data: tasks,
            // });
            res.render('tasks.ejs', {tasksData: tasks})
        }
    })  
};
// Handle create task actions
exports.new = ((req, res) => {
    var task = new Task();
    task.name = req.body.name ? req.body.name : task.name;
    task.description = req.body.description;
    task.deadline = req.body.deadline;
    task.completed = req.body.completed;
    task.assignedUser = req.body.assignedUser;
    task.assignedUserName = req.body.assignedUserName;

// save the task and check for errors
    task.save(function (err) {
        if (err)
            res.json(err);
    res.json({
                message: 'New task created!',
                data: task
            });
        });
});
// Handle view task info
exports.view = ((req, res) => {
    Task.findById(req.params.task_id, (err, task) => {
        if (err )
            res.status(404).send(err);
        else if ( task == null){
            res.status(404).send({
                message: "No tasks find",
                data: []
            });
        }else{
            res.json({
                message: 'Task details loading..',
                data: task
            });
        }
    });
});

exports.update = ((req, res) => {
    Task.findById(req.params.task_id)
    .then((task) => {
        if(task){
        task.name = req.body.name ? req.body.name : task.name;
        task.description = req.body.description;
        task.deadline = req.body.deadline;
        task.completed = req.body.completed;
        task.assignedUser = req.body.assignedUser;
        task.assignedUserName = req.body.assignedUserName;
        task.save()
            .then((task) => {
                res.json({
                    messager: 'Task Infor Updated',
                    data: task
                })
                })
            .catch((err) => {
                res.status(404).send(err);
            })
        }
        else{
            res.status(404).send(err);
        }
        })
    .catch((err) => {
                res.status(404).send(err);
            })
})

// Handle delete task
exports.delete = ((req, res) => {
    Task.findByIdAndDelete(req.params.task_id, (err, task) => {
        if (err)
            res.status(404).send(err);
        else if ( task == null){
            res.status(404).send({
                message: "No tasks find",
                data: []
            });
        }else{

            if (task.assignedUser != null && !task.completed){
                User.findById(task.assignedUser, (err, user) => {
                    if (user != null){
                        user.pendingTasks.splice(user.pendingTasks.indexOf(task._id), 1)
                        user.save()
                    }
                })
            }

            res.json({
                status: "success",
                message: 'Task successfully deleted',
            });
        }
    });
});