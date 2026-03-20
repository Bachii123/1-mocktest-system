const Test = require("../models/Test");


// CREATE TEST (Faculty)

exports.createTest = async (req, res) => {

  try {

    const { title, calculatorEnabled, questions } = req.body;

    console.log('Received data:', { title, calculatorEnabled, questions });

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    for (let q of questions) {
      if (!q.question || !q.options || q.options.length < 2 || !q.answer) {
        return res.status(400).json({ message: "Each question must have a question text, at least 2 options, and an answer" });
      }
      if (!q.options.includes(q.answer)) {
        return res.status(400).json({ message: "The answer must be one of the options" });
      }
      if (q.difficulty && !["Easy", "Medium", "Hard"].includes(q.difficulty)) {
        return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard" });
      }
    }

    const test = new Test({
      title,
      calculatorEnabled,
      questions
    });

    await test.save();

    res.status(201).json({
      message: "Test created successfully",
      test
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// GET ALL TESTS (Students)

exports.getTests = async (req, res) => {

  try {

    const tests = await Test.find();

    res.json(tests);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};