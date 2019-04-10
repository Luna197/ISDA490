// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.render('index.ejs')
    // res.json({
    //    status: 'API Its Working',
    //    message: 'Welcome to RESTHub crafted with love!',
    // });
});


// Import user controller
var userController = require('./userController');
// User routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    // .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

// Import task controller
var taskController = require('./taskController');
// task routes
router.route('/tasks')
    .get(taskController.index)
    .post(taskController.new);

router.route('/tasks/:task_id')
    .get(taskController.view)
    // .patch(taskController.update)
    .put(taskController.update)
    .delete(taskController.delete);
// Export API routes
module.exports = router;


