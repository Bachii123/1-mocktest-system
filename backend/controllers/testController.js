const Test = require("../models/Test");

// CREATE TEST
exports.createTest = async (req, res) => {
  try {
    const { title, calculatorEnabled, duration, questions, facultyId } = req.body;

    console.log("Received data:", {
      title,
      calculatorEnabled,
      duration,
      questions,
      facultyId
    });

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Title and at least one question are required"
      });
    }

    if (!duration || duration <= 0) {
      return res.status(400).json({
        message: "Please enter a valid test duration"
      });
    }

    for (let q of questions) {
      if (!q.question || !q.options || q.options.length < 2 || !q.answer) {
        return res.status(400).json({
          message: "Each question must have question text, at least 2 options, and answer"
        });
      }

      if (!q.options.includes(q.answer)) {
        return res.status(400).json({
          message: "Answer must be one of the options"
        });
      }

      if (q.difficulty && !["Easy", "Medium", "Hard"].includes(q.difficulty)) {
        return res.status(400).json({
          message: "Difficulty must be Easy, Medium, or Hard"
        });
      }
    }

    const test = new Test({
      title,
      calculatorEnabled: calculatorEnabled || false,
      duration,
      questions,
      facultyId
    });

    await test.save();

    res.status(201).json({
      message: "Test created successfully",
      test
    });

  } catch (error) {
    console.error("CREATE TEST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL TESTS
exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    console.error("GET TESTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET TESTS BY FACULTY
exports.getFacultyTests = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const tests = await Test.find({ facultyId });

    res.json(tests);

  } catch (error) {
    console.error("GET FACULTY TESTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE TEST
exports.deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    await Test.findByIdAndDelete(testId);

    res.json({ message: "Test deleted successfully" });

  } catch (error) {
    console.error("DELETE TEST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};