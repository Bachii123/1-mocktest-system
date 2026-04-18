const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true
  },

  score: {
    type: Number,
    default: 0
  },

  total: {
    type: Number,
    default: 0
  },

  suggestion: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("Result", ResultSchema);