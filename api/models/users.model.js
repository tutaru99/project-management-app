module.exports = mongoose => {
  const schema =
    mongoose.Schema(
      {
        username: {
          type: String,
          required: true,
          min: 6,
          max: 255
        },
        email: {
          type: String,
          required: true,
          min: 6,
          max: 255
        },
        password: {
          type: String,
          required: true,
          min: 6,
          max: 255
        },
        date: {
          type: Date,
          default: Date.now
        }
      },
      { timestamps: true }
    )

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};