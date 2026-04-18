const Result = require("../models/Result");
const Attempt = require("../models/Attempt");
const Test = require("../models/Test");

// OPTIONAL MANUAL RESULT GENERATION
exports.generateResult = async (req, res) => {
  try {
    const { attemptId } = req.body;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const test = await Test.findById(attempt.testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let score = 0;

    attempt.answers.forEach((ans) => {
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

    let result = await Result.findOne({
      studentId: attempt.studentId,
      testId: attempt.testId
    });

    if (result) {
      result.score = score;
      result.total = test.questions.length;
      result.suggestion = suggestion;
      await result.save();
    } else {
      result = new Result({
        studentId: attempt.studentId,
        testId: attempt.testId,
        score,
        total: test.questions.length,
        suggestion
      });

      await result.save();
    }

    res.json(result);

  } catch (err) {
    console.error("GENERATE RESULT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET TEST ANALYSIS
exports.getTestAnalysis = async (req, res) => {
  try {
    const { testId } = req.params;

    const results = await Result.find({ testId })
      .populate("studentId", "name email")
      .populate("testId");

    if (!results || results.length === 0) {
      return res.json({
        totalStudents: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        results: []
      });
    }

    const scores = results.map((r) => r.score);

    const totalStudents = results.length;
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / totalStudents
    );
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    res.json({
      totalStudents,
      avgScore,
      highestScore,
      lowestScore,
      results
    });

  } catch (error) {
    console.error("GET TEST ANALYSIS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};