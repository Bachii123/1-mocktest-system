import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FacultyAnalysisPage.css";

function FacultyAnalysisPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/results/analysis/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("API ERROR:", err.response || err);
    } finally {
      setLoading(false);
    }
  }, [testId, token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchAnalysis();
  }, [fetchAnalysis, token, navigate]);

  if (loading) {
    return <div className="analysis-loading">Loading analysis...</div>;
  }

  if (!data || !data.results) {
    return <div className="analysis-loading">No Data Found</div>;
  }

  const scores = data.results.map((r) => r.score);
  const maxScore = Math.max(...scores, 1);

  const topicMap = {};
  const difficultyMap = { Easy: 0, Medium: 0, Hard: 0 };

  // Count unique test questions only once
  const uniqueQuestions = data.results[0]?.testId?.questions || [];

  uniqueQuestions.forEach((q) => {
    const topic = q.topic || "General";
    topicMap[topic] = (topicMap[topic] || 0) + 1;

    const diff = q.difficulty || "Medium";
    if (difficultyMap[diff] !== undefined) {
      difficultyMap[diff] += 1;
    }
  });

  const getSuggestion = () => {
    if (data.avgScore < 40) {
      return "Students are struggling with this test. Consider revising the basic concepts and adding more easy-to-medium level practice questions before moving to advanced topics.";
    }

    if (data.avgScore >= 40 && data.avgScore < 70) {
      return "Student performance is average. Strengthen understanding in weak topics and encourage more targeted practice on medium-difficulty questions.";
    }

    return "Great overall performance. Students are doing well, so you can gradually increase difficulty and introduce more challenging problem-solving questions.";
  };

  return (
    <div className="analysis-container">
      <div className="analysis-topbar">
        <div>
          <h1 className="analysis-title">Faculty Test Analysis</h1>
          <p className="analysis-subtitle">
            Complete performance overview for this test
          </p>
        </div>

        <button className="back-btn" onClick={() => navigate("/faculty-dashboard")}>
          ← Back
        </button>
      </div>

      {/* SUMMARY */}
      <div className="summary-box">
        <div className="card">
          <h3>Total Students</h3>
          <p>{data.totalStudents}</p>
        </div>

        <div className="card">
          <h3>Average Score</h3>
          <p>{data.avgScore}</p>
        </div>

        <div className="card">
          <h3>Highest Score</h3>
          <p>{data.highestScore}</p>
        </div>

        <div className="card">
          <h3>Lowest Score</h3>
          <p>{data.lowestScore}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        {/* SCORE GRAPH */}
        <div className="graph-section">
          <h2>Score Distribution</h2>
          <div className="bar-container">
            {scores.length === 0 ? (
              <p className="empty-chart-text">No scores available</p>
            ) : (
              scores.map((score, i) => (
                <div key={i} className="bar-wrapper">
                  <div
                    className="bar score-bar"
                    style={{ height: `${(score / maxScore) * 180}px` }}
                  ></div>
                  <span className="bar-label">S{i + 1}</span>
                  <span className="bar-value">{score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOPIC GRAPH */}
        <div className="graph-section">
          <h2>Topic-wise Questions</h2>
          <div className="bar-container">
            {Object.keys(topicMap).length === 0 ? (
              <p className="empty-chart-text">No topics available</p>
            ) : (
              Object.keys(topicMap).map((topic, i) => (
                <div key={i} className="bar-wrapper">
                  <div
                    className="bar topic-bar"
                    style={{ height: `${topicMap[topic] * 28}px` }}
                  ></div>
                  <span className="bar-label topic-label">{topic}</span>
                  <span className="bar-value">{topicMap[topic]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DIFFICULTY GRAPH */}
        <div className="graph-section">
          <h2>Difficulty Distribution</h2>
          <div className="bar-container">
            {Object.keys(difficultyMap).map((d, i) => (
              <div key={i} className="bar-wrapper">
                <div
                  className={`bar difficulty-bar ${
                    d === "Easy"
                      ? "easy-bar"
                      : d === "Medium"
                      ? "medium-bar"
                      : "hard-bar"
                  }`}
                  style={{ height: `${difficultyMap[d] * 28}px` }}
                ></div>
                <span className="bar-label">{d}</span>
                <span className="bar-value">{difficultyMap[d]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="suggestion-box">
        <h2>Suggestions</h2>
        <p>{getSuggestion()}</p>
      </div>

      {/* RESULTS */}
      <div className="results-section">
        <h2>Student Results</h2>

        {data.results.length === 0 ? (
          <p className="empty-chart-text">No student attempts yet</p>
        ) : (
          <div className="results-grid">
            {data.results.map((r, i) => (
              <div key={i} className="result-card">
                <div className="student-avatar">
                  {r.studentId?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div>
                  <p><strong>Name:</strong> {r.studentId?.name || "Unknown"}</p>
                  <p><strong>Score:</strong> {r.score} / {r.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyAnalysisPage;