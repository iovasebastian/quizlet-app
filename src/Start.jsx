import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';

const Start = () => {
  let navigate = useNavigate();

  function switchScreen() {
    // Navigate to the "/main" route
    navigate('/quizlet-app/main');
  }

  return <button className='startButton' onClick={switchScreen}>Start</button>;
};

export default Start;