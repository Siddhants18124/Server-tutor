const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionTitle: String,
  body: String,
});

const moduleSchema = new mongoose.Schema({
  moduleTitle: String,
  sections: [sectionSchema],
});

// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   language: {
//     type: String,
//     required: true,
//   },
//   modules: [moduleSchema],
// });

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  modules: [moduleSchema],
  completionPercentage: { type: Number, default: 0 },
});


const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
