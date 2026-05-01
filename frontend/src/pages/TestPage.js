import Calculator from "../components/Calculator";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TestPage.css";

function TestPage() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [showCalc, setShowCalc] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  /* LOAD TESTS */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tests", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setTests(res.data || []))
      .catch((err) => {
        console.error("LOAD TESTS ERROR:", err.response || err);
        setError("Error loading tests");
      });
  }, [token]);

  /* CLOSE CALCULATOR FROM INSIDE COMPONENT */
  useEffect(() => {
    const closeCalculator = () => setShowCalc(false);

    window.addEventListener("closeCalc", closeCalculator);

    return () => {
      window.removeEventListener("closeCalc", closeCalculator);
    };
  }, []);

  /* SUBMIT FUNCTION */
  const submitTest = useCallback(async () => {
    try {
      if (!selectedTest) return;

      setSubmitting(true);

      const formattedAnswers = questions.map((q, index) => ({
        questionId: q._id,
        answer: answers[index] || ""
      }));

      const payload = {
        testId: selectedTest._id,
        answers: formattedAnswers,
        notes: [],
        difficultyMarks: []
      };

      console.log("SUBMIT PAYLOAD:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/attempts/submit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("SUBMIT RESPONSE:", res.data);

      navigate("/result", {
        state: {
          questions,
          answers,
          backendResult: res.data.result,
          testId: selectedTest._id
        }
      });

    } catch (err) {
      console.error("SUBMIT ERROR:", err.response || err);
      alert(err.response?.data?.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  }, [selectedTest, questions, answers, navigate, token]);

  /* TIMER */
  useEffect(() => {
    if (!selectedTest) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTest, submitTest]);

  /* FORMAT TIME */
  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ANSWER */
  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  /* MARK FOR REVIEW */
  const markForReview = () => {
    if (!marked.includes(currentQuestion)) {
      setMarked([...marked, currentQuestion]);
    }
  };

  /* COLORS */
  const getColor = (index) => {
    if (marked.includes(index)) return "#f59e0b";
    if (answers[index]) return "#22c55e";
    return "#334155";
  };

  /* DIFFICULTY */
  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || "").toLowerCase();
    if (d === "easy") return "#22c55e";
    if (d === "medium") return "#f59e0b";
    if (d === "hard") return "#ef4444";
    return "#f59e0b";
  };

  /* NAVIGATION */
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (error) {
    return (
      <h2 style={{ textAlign: "center", color: "#ef4444", marginTop: "40px" }}>
        {error}
      </h2>
    );
  }

  if (!selectedTest) {
    return (
      <div className="test-list-container">
        <div className="test-list-header">
          <h1>Select a Test</h1>
          <p>Choose a test and start your mock exam</p>
        </div>

        {tests.length === 0 ? (
          <p className="loading-text">Loading tests...</p>
        ) : (
          <div className="test-list">
            {tests.map((test, index) => (
              <div key={index} className="test-card">
                <div className="test-card-top">
                  <h3>{test.title || `Test ${index + 1}`}</h3>
                  <span className="question-count">
                    {test.questions?.length || 0} Questions
                  </span>
                </div>

                <div className="test-meta">
                  <span>⏱ {test.duration || 10} min</span>
                  <span>
                    🧮 {test.calculatorEnabled ? "Calculator On" : "Calculator Off"}
                  </span>
                </div>

                <button
                  className="take-test-btn"
                  onClick={() => {
                    setSelectedTest(test);
                    setQuestions(test.questions || []);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setMarked([]);
                    setShowCalc(false);
                    setTimeLeft((test.duration || 10) * 60);
                  }}
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        No Questions Available
      </h2>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="test-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="header">
          <div>
            <h1>{selectedTest.title || "Mock Test"}</h1>
            <p className="sub-text">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="timer">⏳ {formatTime()}</div>
        </div>

        <div className="question-box">
          <div className="question-top">
            <span
              className="difficulty-badge"
              style={{ background: getDifficultyColor(q.difficulty) }}
            >
              {q.difficulty || "Medium"}
            </span>
          </div>

          <div className="question-header">
            <h2 className="question-text">{q.question}</h2>
          </div>

          <div className="options-wrapper">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`option ${answers[currentQuestion] === opt ? "selected-option" : ""}`}
              >
                <input
                  type="radio"
                  checked={answers[currentQuestion] === opt}
                  onChange={() => handleAnswer(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="btn-group">
          <button onClick={markForReview} className="mark-btn">
            Mark for Review
          </button>

          <button onClick={prevQuestion} className="nav-btn">
            Prev
          </button>

          <button onClick={nextQuestion} className="nav-btn">
            Next
          </button>

          <button onClick={submitTest} className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h3>Question Palette</h3>

        <div className="legend-box">
          <div><span className="legend-dot answered"></span> Answered</div>
          <div><span className="legend-dot marked"></span> Marked</div>
          <div><span className="legend-dot unanswered"></span> Unanswered</div>
        </div>

        <div className="question-grid">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              style={{ backgroundColor: getColor(index) }}
              className={`question-btn ${currentQuestion === index ? "active-question" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* CALCULATOR ONLY IF ENABLED */}
      {selectedTest.calculatorEnabled && (
        <>
          <button onClick={() => setShowCalc(!showCalc)} className="calc-btn">
            🧮
          </button>

          {showCalc && (
            <div className="calculator-popup">
              <Calculator />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestPage;