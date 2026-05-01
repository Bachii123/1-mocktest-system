export default function QuestionNavigator({
  questions,
  current,
  setCurrent,
  answers
}) {

  return (
    <div className="navigator">

      <h3>Questions</h3>

      <div className="nav-grid">

        {questions.map((q, index) => {

          let className = "nav-btn";

          if (answers[q._id]) className += " attempted";
          if (index === current) className += " active";

          return (
            <button
              key={q._id}
              className={className}
              onClick={() => setCurrent(index)}
            >
              {index + 1}
            </button>
          );
        })}

      </div>

    </div>
  );
}