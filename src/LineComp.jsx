// LineComp.jsx
import './lineComp.css';
import React, { useState } from "react";

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  const handleQuestionChange =(e) => {
    setQuestion(e.target.value);
    onInputComplete({ question: e.target.value, answer });
  };
  

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    onInputComplete({ question, answer: e.target.value });
  };

  return (
    <div className="lineComp">
      <span>Question:</span>
      <input type="text" value={question} onChange={handleQuestionChange} required/>
      <span>Answer: </span>
      <input type="text" value={answer} onChange={handleAnswerChange} required/>
    </div>
  );
};

export default LineComp;
