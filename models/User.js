const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: "Username is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        //referencing same model
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//virtual called friendCount that retrieves the length of uses friends array field on query
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
