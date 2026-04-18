const Attempt = require("../models/Attempt");
const Result = require("../models/Result");
const Test = require("../models/Test");

exports.submitAttempt = async (req, res) => {
  try {
    const { testId, answers, notes, difficultyMarks } = req.body;

    if (!testId || !answers) {
      return res.status(400).json({ message: "testId and answers are required" });
    }

    const studentId = req.user.id;

    //  Get test with embedded questions
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    //  Save attempt
    const attempt = new Attempt({
      studentId,
      testId,
      answers,
      notes: notes || [],
      difficultyMarks: difficultyMarks || []
    });

    await attempt.save();

    //  Calculate score using Test.questions
    let score = 0;

    answers.forEach((ans) => {
      const q = test.questions.find(
        (q) => q._id.toString() === ans.questionId
      );

      if (q && q.answer === ans.answer) {
        score++;
      }
    });

    let suggestion = "Good attempt. Practice more.";

    if (score < test.questions.length / 2) {
      suggestion = "Focus on basics and practice easy questions.";
    } else if (score >= test.questions.length * 0.7) {
      suggestion = "Great job! Try harder questions.";
    }

    //  Avoid duplicate result for same student + same test
    let result = await Result.findOne({ studentId, testId });

    if (result) {
      result.score = score;
      result.total = test.questions.length;
      result.suggestion = suggestion;
      await result.save();
    } else {
      result = new Result({
        studentId,
        testId,
        score,
        total: test.questions.length,
        suggestion
      });
      await result.save();
    }

    res.status(201).json({
      message: "Attempt submitted and result generated successfully",
      attempt,
      result
    });

  } catch (error) {
    console.error("SUBMIT ATTEMPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};