// taskModel.js
var mongoose = require('mongoose');
// Setup schema
var taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
    },
    assignedUser: {
        type: String,
        default: "",
    },
    assignedUserName: {
        type: String,
        default: "unassigned",
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});
// Export Task model
var Task = module.exports = mongoose.model('task', taskSchema);
module.exports.get = function (callback, limit) {
    Task.find(callback).limit(limit);
}
