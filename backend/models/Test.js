const mongoose = require("mongoose");

// ✅ DEFINE QuestionSchema FIRST
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  difficulty: String,   // easy | medium | hard
  topic: String
});

// ✅ THEN USE IT
const TestSchema = new mongoose.Schema({
  title: String,
  questions: [QuestionSchema]
});

module.exports = mongoose.model("Test", TestSchema);