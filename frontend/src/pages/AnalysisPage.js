import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AnalysisPage.css";

function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, answers, backendResult, testId } = location.state || {};

  if (!questions || questions.length === 0) {
    return <h2 className="no-data">No Data Available</h2>;
  }

  let score = 0;

  return (
    <div className="analysis-container">
      <div className="analysis-wrapper">
        <div className="analysis-header">
          <h1 className="analysis-title">Detailed Analysis</h1>
          <p className="analysis-subtitle">
            Review each question with your selected answer and the correct answer
          </p>
        </div>

        <div className="analysis-list">
          {questions.map((q, index) => {
            const selected = answers[index];
            const correct = q.correctAnswer || q.answer;
            const isCorrect = selected === correct;

            if (isCorrect) score++;

            return (
              <div
                key={index}
                className={`analysis-card ${isCorrect ? "correct" : "wrong"}`}
              >
                <div className="card-top">
                  <div className="question-badge">Question {index + 1}</div>
                  <div className={`status-pill ${isCorrect ? "status-correct" : "status-wrong"}`}>
                    {isCorrect ? "Correct" : "Wrong"}
                  </div>
                </div>

                <div className="question-box">
                  <h3 className="question-text">{q.question}</h3>
                </div>

                <div className="answer-section">
                  <div className="answer-card your-answer">
                    <p className="answer-label">Your Answer</p>
                    <p className="answer-value">{selected || "Not Answered"}</p>
                  </div>

                  <div className="answer-card correct-answer">
                    <p className="answer-label">Correct Answer</p>
                    <p className="answer-value">{correct}</p>
                  </div>
                </div>

                <div className="meta-section">
                  <div className="meta-box">
                    <span className="meta-title">Topic</span>
                    <span className="meta-value">{q.topic || "General"}</span>
                  </div>

                  <div className="meta-box">
                    <span className="meta-title">Difficulty</span>
                    <span
                      className={`meta-value difficulty ${
                        (q.difficulty || "medium").toLowerCase()
                      }`}
                    >
                      {q.difficulty || "Medium"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="score-container">
          <h2>Final Score</h2>
          <p>
            {score} / {questions.length}
          </p>
        </div>

        <div className="analysis-btn-row">
          <button
            className="back-btn"
            onClick={() =>
              navigate("/result", {
                state: { questions, answers, backendResult, testId }
              })
            }
          >
            Back to Result
          </button>

          <button className="home-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;