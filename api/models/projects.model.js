module.exports = mongoose => {
  const Projects = mongoose.model(
    "project",
    mongoose.Schema(
      {
        title: String,
        description: String,
        completed: Boolean,
        columns: [{
          col_name: String,
          tasks: [{
            task_name: String,
            task_description: String,
            task_time: Number,
            task_state: String,
            task_priority: String,
            asignee: [ {
              type: [mongoose.Schema.Types.ObjectId],
              ref: "user"
            }]

          }]
        }],
        owner: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "user"
        },
        users: [{
          type: [mongoose.Schema.Types.ObjectId],
          ref: "user"
        }],
      },
      { timestamps: true }
    )
  );
  return Projects;
};