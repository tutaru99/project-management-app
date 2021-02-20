module.exports = mongoose => {
    const Projects = mongoose.model(
      "project",
      mongoose.Schema(
        {
          title: String,
          description: String,
          completed: Boolean,
          columns: {
              col_name: String,
              tasks: [{
                task_name: String,
                task_description: String
              }]
          }
        },
        { timestamps: true }
      )
    );
    return Projects;
  };