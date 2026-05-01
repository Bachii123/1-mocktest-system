import { useState } from "react";
import NotesBox from "./NotesBox";

export default function QuestionCard({ question, selected, setSelected }) {

  const getDifficultyColor = (difficulty) => {
  if (difficulty === "easy") return "green";
  if (difficulty === "medium") return "yellow";
  if (difficulty === "hard") return "red";
  return "gray";
};

  const getColor = (difficulty) => {
    if (difficulty === "Easy") return "green";
    if (difficulty === "Medium") return "orange";
    if (difficulty === "Hard") return "red";
  };

  return (
    <div className="card">

      <h3>{question.questionText}</h3>

      <p style={{ color: getColor(question.difficulty) }}>
        Difficulty: {question.difficulty}
      </p>
      <div className="question-header">
  <span
    className="difficulty-ball"
    style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
  ></span>
  <h3>{question.questionText}</h3>
</div>

      {question.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              name={question._id}
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
            />
            {opt}
          </label>
        </div>
      ))}

      <NotesBox />

    </div>
  );
}