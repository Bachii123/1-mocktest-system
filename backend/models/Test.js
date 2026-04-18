const mongoose = require("mongoose");

// Embedded question schema
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  topic: {
    type: String,
    default: "General"
  }
});

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  calculatorEnabled: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 10
  },

  questions: [QuestionSchema],

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Test", TestSchema);