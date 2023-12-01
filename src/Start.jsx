import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';

const Start = () => {
  let navigate = useNavigate();

  function switchScreen() {
    // Navigate to the "/main" route
    navigate('/quizlet-app/main');
  }

  return <button onClick={switchScreen} className='startButton'>Start</button>;
};

export default Start;