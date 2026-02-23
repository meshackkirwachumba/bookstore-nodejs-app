const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [6, "Password must be at least six characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Array of allowed string values
      default: "user", //set a default value
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
