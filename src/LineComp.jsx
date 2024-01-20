// LineComp.jsx
import './lineComp.css';
import React, { useState } from "react";

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete, index,deleteLine }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    onInputComplete({ question: e.target.value, answer });
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    onInputComplete({ question, answer: e.target.value });
  };

  console.log(`LineComp ${index} rendered with question: ${question}, answer: ${answer}`);
  const handleDelete = () => {
    deleteLine();
  };

  return (
    <div className="lineComp">
      <span>{index+1} :</span>
      <span>Question:</span>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        required
      />
      <span>Answer: </span>
      <input
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        required
      />
    <button className = 'buttonDelete' onClick={handleDelete}>DELETE</button>
    </div>
  );
};


export default LineComp;
