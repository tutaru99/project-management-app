const db = require("../models");
const Project = project = db.projects;              /* WORKAROUND FOR NOW  - READ/WRITE  */
const ObjectId = require('mongodb').ObjectID;
const mongoose = require("mongoose");

// Create and Save a new Project
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Project
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        columns: req.body.columns,
        published: req.body.published ? req.body.published : false
    });

    // Save Project in the database
    project
        .save(project)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Project."
            });
        });
};

// Retrieve all Projects from the database.
exports.findAll = (req, res) => {
   project.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Projects."
            });
        });

};

// Find a single Project by an ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    project.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Project not found with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Project with id=" + id });
        });
};

// Update a Project by the ID
exports.update = (req, res) => {
    const id = req.params.id;

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!" + " - " + console.log(req.body),
        });
    }

project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update Project with id=${id}. Maybe Project was not found!`
            });
        } else res.send({ message: "Project was updated successfully." + " With id: " + id + " consolelog: " + console.log(req.body) });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Project with id=" + id
        });
    });
};

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    project.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
                });
            } else {
                res.send({
                    message: "Project was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Project with id=" + id
            });
        });
};

//TASKS
// Delete a Single Task by ID
exports.deleteTask = (req, res) => {
    const id = req.params.id;

    project.update({ "columns.tasks._id": mongoose.Types.ObjectId(id) },
        {
            $pull:
                { "columns.$[].tasks": { "_id": mongoose.Types.ObjectId(id) } }
        },
        { "columns.tasks.$": true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update task with id=${id}.`
                });
            } else res.send({ message: "Task was deleted successfully!" });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tasks-."
            });
        });
};

// Add a new Task to column
exports.addTask = (req, res) => {
    const id = req.params.id;

    project.update({ "columns._id": mongoose.Types.ObjectId(id) },
        {
            $push: {
                "columns.$.tasks": {
                    "task_name": req.body.task_name,
                    "task_description": req.body.task_description
                }
            }
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot add task with id=${id}.`
                });
            } else res.send({ message: "Task was ADDED successfully!" });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tasks-."
            });
        });
};

// Update a TASK by the ID
exports.updateTask = (req, res) => {
    const id = req.params.id;

    project.update({ "columns.tasks._id": mongoose.Types.ObjectId(id) },
        {
            $set: {
                "columns.$[].tasks.$[taskfield].task_name": req.body.task_name,
                "columns.$[].tasks.$[taskfield].task_description": req.body.task_description,
                "columns.$[].tasks.$[taskfield].task_time": req.body.task_time,
                "columns.$[].tasks.$[taskfield].task_state": req.body.task_state,
                "columns.$[].tasks.$[taskfield].task_priority": req.body.task_priority,
            }
        },
        { arrayFilters: [{ "taskfield._id": mongoose.Types.ObjectId(id) }] }
    )
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update task with id=${id}.`
                });
            } else res.send({ message: "Task was Edited successfully!" + `${id}` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Editing task-"
            });
        });
};


//COLUMNS
// Delete a Column with the specified ID
exports.deleteColumn = (req, res) => {
    const id = req.params.id;

    project.update({ "columns._id": mongoose.Types.ObjectId(id) },
        {
            $pull:
                { "columns": { "_id": mongoose.Types.ObjectId(id) } }
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete column with id=${id}.`
                });
            } else res.send({ message: "column was deleted successfully!" + `${id}` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving column-."
            });
        });
};

// Add a new Column to project
exports.addColumn = (req, res) => {
    const id = req.params.id;

    project.update({ "_id": mongoose.Types.ObjectId(id) },
        {
            $push: {
                "columns": {
                    "col_name": req.body.col_name
                }
            }
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot add Column with id=${id}.`
                });
            } else res.send({ message: "Column was ADDED successfully!" });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Column-."
            });
    });
};


//PROJECT
// Delete all Projects at once from the database.
exports.deleteAll = (req, res) => {

    project.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Projects were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all projects."
            });
    });
};

// Find Projects by set Condition
exports.findAllCompleted = (req, res) => {

    project.find({ completed: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving projects."
            });
    });
};