import React, { useState } from "react";
import "./Calculator.css";

const Calculator = () => {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (input === "Error") {
      setInput(value);
      return;
    }
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDelete = () => {
    if (input === "Error") {
      setInput("");
      return;
    }
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(input);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-topbar">
        <h3>Calculator</h3>
        <button
          className="calc-close-btn"
          onClick={() => window.dispatchEvent(new Event("closeCalc"))}
        >
          ✕
        </button>
      </div>

      <div className="calculator">
        <input
          type="text"
          value={input}
          readOnly
          className="display"
          placeholder="0"
        />

        <div className="buttons">
          <button className="calc-key action" onClick={handleClear}>C</button>
          <button className="calc-key action" onClick={handleDelete}>⌫</button>
          <button className="calc-key operator" onClick={() => handleClick("%")}>%</button>
          <button className="calc-key operator" onClick={() => handleClick("/")}>÷</button>

          <button className="calc-key" onClick={() => handleClick("7")}>7</button>
          <button className="calc-key" onClick={() => handleClick("8")}>8</button>
          <button className="calc-key" onClick={() => handleClick("9")}>9</button>
          <button className="calc-key operator" onClick={() => handleClick("*")}>×</button>

          <button className="calc-key" onClick={() => handleClick("4")}>4</button>
          <button className="calc-key" onClick={() => handleClick("5")}>5</button>
          <button className="calc-key" onClick={() => handleClick("6")}>6</button>
          <button className="calc-key operator" onClick={() => handleClick("-")}>−</button>

          <button className="calc-key" onClick={() => handleClick("1")}>1</button>
          <button className="calc-key" onClick={() => handleClick("2")}>2</button>
          <button className="calc-key" onClick={() => handleClick("3")}>3</button>
          <button className="calc-key operator" onClick={() => handleClick("+")}>+</button>

          <button className="calc-key" onClick={() => handleClick("(")}>(</button>
          <button className="calc-key" onClick={() => handleClick("0")}>0</button>
          <button className="calc-key" onClick={() => handleClick(")")}> ) </button>
          <button className="calc-key equal" onClick={handleCalculate}>=</button>

          <button className="calc-key zero-wide" onClick={() => handleClick(".")}>.</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;