// LineComp.jsx
import './lineComp.css';
import React, { useState } from "react";

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete, index,deleteLine }) => {
  const [questions, setQuestion] = useState(initialQuestion);
  const [answers, setAnswer] = useState(initialAnswer);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    onInputComplete({ questions: e.target.value, answers });
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    onInputComplete({ questions, answers: e.target.value });
  };

  console.log(`LineComp ${index} rendered with question: ${questions}, answer: ${answers}`);
  const handleDelete = () => {
    deleteLine();
  };

  return (
    <div className="lineComp">
      <span>{index+1} :</span>
      <span>Question:</span>
      <input
        type="text"
        value={questions}
        onChange={handleQuestionChange}
        required
      />
      <span>Answer: </span>
      <input
        type="text"
        value={answers}
        onChange={handleAnswerChange}
        required
      />
    <button className = 'buttonDelete' onClick={handleDelete}>DELETE</button>
    </div>
  );
};


export default LineComp;
