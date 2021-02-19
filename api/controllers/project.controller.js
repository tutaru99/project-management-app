const db = require("../models");
const Project = db.projects;

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

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Find a single Project with an id
exports.findOne = (req, res) => {

};

// Update a Project by the id in the request
exports.update = (req, res) => {

};

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};