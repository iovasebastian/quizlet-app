// LineComp.jsx
import './lineComp.css';
import React, { useState } from "react";

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete, index }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    onInputComplete(index, { question: e.target.value, answer });
    onInputComplete(index, { question: e.target.value, answer });
  };


  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    onInputComplete(index, { question, answer: e.target.value });
    onInputComplete(index, { question, answer: e.target.value });
  };

  console.log(`LineComp ${index} rendered with question: ${question}, answer: ${answer}`);

  return (
    <div className="lineComp">
      <span>{index+1} :</span>
      <span>{index+1} :</span>
      <span>Question:</span>
      <input type="text" value={question} onChange={handleQuestionChange} required/>
      <span>Answer: </span>
      <input type="text" value={answer} onChange={handleAnswerChange} required/>
    </div>
  );
};

export default LineComp;
