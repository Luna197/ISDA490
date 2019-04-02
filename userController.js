// userController.js
// Import user model
User = require('./userModel');
Task = require('./taskModel');
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

    User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec((err, users)=>{
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        else{
            if(count == 1)
            {users = users.length}
            
            res.json({
                status: "success",
                message: "Users retrieved successfully",
                data: users,
            });
        }
    })  
};
// Handle create user actions
exports.new = ((req, res) => {
    var user = new User();
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email;
    user.pendingTasks  = req.body.pendingTasks;
    
// save the user and check for errors
    user.save(function (err) {
        if (err)
            res.json(err);
    res.json({
                message: 'New user created!',
                data: user
            });
        });
});

// Handle view user info
exports.view = ((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err )
            res.status(404).send(err);
        else if ( user == null){
            res.status(404).send({
                message: "No users find",
                data: []
            });
        }else{
            res.json({
                message: 'User details loading..',
                data: user
            });
        }
    });
});

exports.update = ((req, res) => {
    User.findById(req.params.user_id)
    .then((user) => {
        if(user){
        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email;
        user.pendingTasks = req.body.pendingTasks;
        user.save()
            .then((user) => {
                res.json({
                    messager: 'User Infor Updated',
                    data: user
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
    User.findByIdAndDelete(req.params.user_id, (err, user) => {
        // As always, handle any potential errors:
        if (err) 
            res.status(404).send(err);
        else if ( user == null){
            res.status(404).send({
                messange: "No users find",
                data: []
            });
        }else{

            if(user.pendingTasks != null) {
                for(i=0; i<user.pendingTasks.length; i++){
                    Task.findByIdAndDelete(user.pendingTasks[i], (err, task) => {
                        if (err) return res.status(500).send(err);
                        //console.log("task in user already be deleted")
                    })
                }
            }
            res.json({
                status: "success",
                message: 'User successfully deleted',
            });
        }
    });
});
