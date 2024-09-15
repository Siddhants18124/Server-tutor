const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    emailAlerts: {
      type: Boolean,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null
    },
    coursesProgress: [{
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
      completedSections: [Schema.Types.ObjectId],
      progress: Number,
    }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;