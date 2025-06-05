import './lineComp.css';
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete, index, deleteLine }) => {
  const [questionText, setQuestionText] = useState(initialQuestion);
  const [answerText, setAnswerText] = useState(initialAnswer);

  const handleQuestionChange = (e) => {
    setQuestionText(e.target.value);
    onInputComplete({ questionText: e.target.value, answerText });
  };

  const handleAnswerChange = (e) => {
    setAnswerText(e.target.value);
    onInputComplete({ questionText, answerText: e.target.value });
  };

  const handleDelete = () => {
    deleteLine();
  };

  return (
    <div className="lineComp">
      <div className="lineHeader">
        <span className="lineIndex">{index + 1}:</span>
        <FiTrash2 size={20} className="deleteIcon" onClick={handleDelete} />
      </div>
      <div className="lineField">
        <label>Question:</label>
        <input
          type="text"
          className='inputLineComp'
          value={questionText}
          onChange={handleQuestionChange}
          required
        />
      </div>
      <div className="lineField">
        <label>Answer:</label>
        <input
          type="text"
          className='inputLineComp'
          value={answerText}
          onChange={handleAnswerChange}
          required
        />
      </div>
    </div>
  );
};

export default LineComp;
