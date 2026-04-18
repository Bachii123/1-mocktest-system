const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema({
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

  answers: [
    {
      questionId: String,
      answer: String
    }
  ],

  notes: [
    {
      questionId: String,
      note: String
    }
  ],

  difficultyMarks: [
    {
      questionId: String,
      level: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Attempt", AttemptSchema);