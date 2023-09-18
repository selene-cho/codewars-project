const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
});

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completedUsers: {
    type: Number,
    default: 0,
  },
  difficultyLevel: {
    type: Number,
    default: 1,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tests: [testSchema],
  initialCode: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Problem", ProblemSchema);
