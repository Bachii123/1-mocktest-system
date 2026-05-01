import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, answers, backendResult, testId } = location.state || {};

  if (!questions) {
    return (
      <div className="result-container">
        <h2 className="no-result">No Result Data</h2>
      </div>
    );
  }

  let score = 0;

  const topicStats = {};
  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };

  questions.forEach((q, index) => {
    const selected = answers[index];
    const correct = q.answer;

    const topic = q.topic || "General";
    const difficulty = (q.difficulty || "medium").toLowerCase();

    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };

    topicStats[topic].total++;

    if (difficultyStats[difficulty]) {
      difficultyStats[difficulty].total++;
    }

    if (selected === correct) {
      score++;
      topicStats[topic].correct++;

      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].correct++;
      }
    }
  });

  const finalScore = backendResult?.score ?? score;
  const totalQuestions = backendResult?.total ?? questions.length;

  const percentage = Math.round((finalScore / totalQuestions) * 100);
  const result = percentage >= 50 ? "PASS" : "FAIL";

  const topicLabels = Object.keys(topicStats);

  const topicData = {
    labels: topicLabels,
    datasets: [
      {
        label: "Correct",
        data: topicLabels.map((t) => topicStats[t].correct),
        backgroundColor: "#22c55e",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        label: "Wrong",
        data: topicLabels.map(
          (t) => topicStats[t].total - topicStats[t].correct
        ),
        backgroundColor: "#ef4444",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const diffData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Correct",
        data: [
          difficultyStats.easy.correct,
          difficultyStats.medium.correct,
          difficultyStats.hard.correct,
        ],
        backgroundColor: "#38bdf8",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        label: "Wrong",
        data: [
          difficultyStats.easy.total - difficultyStats.easy.correct,
          difficultyStats.medium.total - difficultyStats.medium.correct,
          difficultyStats.hard.total - difficultyStats.hard.correct,
        ],
        backgroundColor: "#f59e0b",
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          font: { size: 13, weight: "500" },
        },
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#cbd5e1",
          stepSize: 1,
          precision: 0,
          font: { size: 13 },
        },
        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },
  };

  // ✅ Better Specific Suggestions
  const getSuggestions = () => {
    let suggestions = [];

    // Overall performance
    if (percentage < 40) {
      suggestions.push(`Your overall score is very low (${percentage}%). You need strong revision in multiple areas.`);
    } else if (percentage < 60) {
      suggestions.push(`Your overall performance is average (${percentage}%). Focus on improving weak topics.`);
    } else if (percentage < 80) {
      suggestions.push(`Good performance (${percentage}%), but you still have some weak areas to improve.`);
    } else {
      suggestions.push(`Excellent work! Your overall performance is very strong (${percentage}%).`);
    }

    // Topic-wise suggestions
    Object.keys(topicStats).forEach((topic) => {
      const t = topicStats[topic];
      const topicPercent = Math.round((t.correct / t.total) * 100);

      if (topicPercent < 40) {
        suggestions.push(`You are weak in "${topic}" (${topicPercent}% accuracy). Practice this topic more.`);
      } else if (topicPercent < 70) {
        suggestions.push(`Your "${topic}" performance is moderate (${topicPercent}%). Revise important concepts.`);
      } else {
        suggestions.push(`You are performing well in "${topic}" (${topicPercent}%). Keep it consistent.`);
      }
    });

    // Difficulty-wise suggestions
    Object.keys(difficultyStats).forEach((diff) => {
      const d = difficultyStats[diff];
      if (d.total === 0) return;

      const diffPercent = Math.round((d.correct / d.total) * 100);

      if (diffPercent < 40) {
        suggestions.push(`Your accuracy in ${diff} questions is low (${diffPercent}%). Practice more ${diff} level problems.`);
      } else if (diffPercent < 70) {
        suggestions.push(`You are doing okay in ${diff} questions (${diffPercent}%), but you can improve further.`);
      } else {
        suggestions.push(`Strong performance in ${diff} questions (${diffPercent}%).`);
      }
    });

    // Final improvement advice
    if (percentage < 80) {
      suggestions.push("Try solving more mock tests regularly to improve both speed and accuracy.");
    } else {
      suggestions.push("Maintain this level by continuing regular practice and revision.");
    }

    return suggestions;
  };

  return (
    <div className="result-container">
      <div className="result-topbar">
        <button className="back-btn" onClick={() => navigate("/test")}>
          ← Back
        </button>
      </div>

      <div className="result-header">
        <h1>Test Result</h1>
        <p className="subtitle">Performance Summary & Analysis</p>
      </div>

      <div className="score-cards">
        <div className="score-card">
          <h3>Score</h3>
          <p>{finalScore} / {totalQuestions}</p>
        </div>

        <div className="score-card">
          <h3>Percentage</h3>
          <p>{percentage}%</p>
        </div>

        <div className="score-card">
          <h3>Status</h3>
          <p className={result === "PASS" ? "pass-text" : "fail-text"}>
            {result}
          </p>
        </div>
      </div>

      <div className="graph-wrapper">
        <div className="graph-card">
          <h3 className="graph-title">Topic-wise Analysis</h3>
          <div className="chart-box">
            <Bar data={topicData} options={chartOptions} />
          </div>
        </div>

        <div className="graph-card">
          <h3 className="graph-title">Difficulty-wise Analysis</h3>
          <div className="chart-box">
            <Bar data={diffData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="suggestion-box">
        <h3>Smart Suggestions</h3>
        <ul>
          {getSuggestions().map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="result-buttons">
        <button
          className="btn-analysis"
          onClick={() =>
            navigate("/analysis", {
              state: { questions, answers, backendResult, testId }
            })
          }
        >
          Detailed Analysis
        </button>

        <button className="btn-home" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ResultPage;