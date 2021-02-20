module.exports = mongoose => {
    const Projects = mongoose.model(
      "project",
      mongoose.Schema(
        {
          title: String,
          description: String,
          columns: {
              col_name: String,
              tasks: [{
                  
              }]
          }
        },
        { timestamps: true }
      )
    );
    return Projects;
  };