import React, { useState, useEffect } from 'react';

const LineComp = ({ initialQuestion = '', initialAnswer = '', onInputComplete }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    // Notify the parent component about input changes
    onInputComplete({ question, answer });
  }, [question, answer, onInputComplete]);

  return (
    <div className="lineComp">
      <span>Question : </span>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <span>Answer : </span>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
    </div>
  );
};

export default LineComp;