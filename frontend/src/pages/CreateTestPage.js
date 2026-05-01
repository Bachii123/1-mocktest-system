import React, { useState } from "react";
import axios from "axios";
import "./CreateTestPage.css";

function CreateTestPage() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(10); // ✅ NEW
  const [calculatorEnabled, setCalculatorEnabled] = useState(false); // ✅ NEW

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: "",
      topic: "",
      difficulty: "Medium"
    },
  ]);

  const [message, setMessage] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        topic: "",
        difficulty: "Medium"
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setMessage("At least one question is required");
      return;
    }

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
    const temp = [...questions];
    temp[index].question = value;
    setQuestions(temp);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const temp = [...questions];
    temp[qIndex].options[oIndex] = value;
    setQuestions(temp);
  };

  const handleAnswerChange = (qIndex, value) => {
    const temp = [...questions];
    temp[qIndex].answer = value;
    setQuestions(temp);
  };

  const handleTopicChange = (qIndex, value) => {
    const temp = [...questions];
    temp[qIndex].topic = value;
    setQuestions(temp);
  };

  const handleDifficultyChange = (qIndex, value) => {
    const temp = [...questions];
    temp[qIndex].difficulty = value;
    setQuestions(temp);
  };

  const submitTest = async () => {
    setMessage("");

    const facultyId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!facultyId || !token) {
      setMessage("Faculty login required");
      return;
    }

    if (!title.trim()) {
      setMessage("Please enter test title");
      return;
    }

    if (!duration || duration <= 0) {
      setMessage("Please enter valid duration in minutes");
      return;
    }

    const cleanedQuestions = questions.map((q) => ({
      question: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
      answer: q.answer.trim(),
      topic: q.topic.trim() || "General",
      difficulty: q.difficulty || "Medium"
    }));

    for (let i = 0; i < cleanedQuestions.length; i++) {
      const q = cleanedQuestions[i];

      if (!q.question) {
        setMessage(`Question ${i + 1} is empty`);
        return;
      }

      if (q.options.some((opt) => !opt)) {
        setMessage(`Please fill all options for Question ${i + 1}`);
        return;
      }

      if (!q.answer) {
        setMessage(`Please select correct answer for Question ${i + 1}`);
        return;
      }

      if (!q.options.includes(q.answer)) {
        setMessage(`Correct answer must match one option in Question ${i + 1}`);
        return;
      }
    }

    try {
      const payload = {
        title: title.trim(),
        duration: Number(duration), // ✅ NEW
        calculatorEnabled, // ✅ NEW
        questions: cleanedQuestions,
        facultyId
      };

      const response = await axios.post(
        "http://localhost:5000/api/tests",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Response:", response.data);

      setMessage("Test created successfully!");
      setTitle("");
      setDuration(10);
      setCalculatorEnabled(false);
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
          topic: "",
          difficulty: "Medium"
        }
      ]);

    } catch (err) {
      console.error("CREATE TEST ERROR:", err.response || err);
      setMessage(err.response?.data?.message || "Error creating test");
    }
  };

  return (
    <div className="create-test-page">
      <div className="create-test-wrapper">

        <div className="page-top">
          <div>
            <h1>Create New Test</h1>
            <p>Build questions, set difficulty, timer, and calculator access easily.</p>
          </div>

          <div className="question-badge">
            {questions.length} Question{questions.length > 1 ? "s" : ""}
          </div>
        </div>

        {message && (
          <div className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="title-section">
          <label>Test Title</label>
          <input
            type="text"
            placeholder="Enter your test title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        {/* ✅ NEW SETTINGS SECTION */}
        <div className="test-settings">
          <div className="field-group">
            <label>Test Duration (in minutes)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="title-input"
              placeholder="Enter duration"
            />
          </div>

          <div className="field-group">
            <label>Calculator Access</label>
            <div className="calc-toggle-row">
              <button
                type="button"
                className={`toggle-btn ${calculatorEnabled ? "active-toggle" : ""}`}
                onClick={() => setCalculatorEnabled(true)}
              >
                Enable
              </button>

              <button
                type="button"
                className={`toggle-btn ${!calculatorEnabled ? "active-toggle off" : ""}`}
                onClick={() => setCalculatorEnabled(false)}
              >
                Disable
              </button>
            </div>
          </div>
        </div>

        <div className="questions-section">
          {questions.map((q, index) => (
            <div key={index} className="question-card">

              <div className="question-card-top">
                <div className="question-number">Question {index + 1}</div>

                {questions.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="field-group">
                <label>Question</label>
                <textarea
                  placeholder={`Enter Question ${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="question-input"
                />
              </div>

              <div className="grid-two">
                <div className="field-group">
                  <label>Topic</label>
                  <input
                    type="text"
                    placeholder="Ex: Algebra, Physics, Grammar"
                    value={q.topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    className="topic-input"
                  />
                </div>

                <div className="field-group">
                  <label>Difficulty</label>
                  <select
                    value={q.difficulty}
                    onChange={(e) => handleDifficultyChange(index, e.target.value)}
                    className="difficulty-select"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label>Options</label>
                <div className="options-grid">
                  {q.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, i, e.target.value)}
                      className="option-input"
                    />
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label>Select Correct Answer</label>
                <div className="answer-grid">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`answer-option ${q.answer === opt ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`answer-${index}`}
                        value={opt}
                        checked={q.answer === opt}
                        onChange={() => handleAnswerChange(index, opt)}
                      />
                      <span>{opt || `Option ${i + 1}`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-row">
          <button onClick={addQuestion} className="add-btn">
            + Add Question
          </button>

          <button onClick={submitTest} className="submit-btn">
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTestPage;