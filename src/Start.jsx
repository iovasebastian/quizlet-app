import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Start.css';

const Start = () => {
  let navigate = useNavigate();

  function switchScreen() {
    // Navigate to the "/main" route
    navigate('/main');
  }

  return(
    <div className='background-start'>
      <button onClick={switchScreen} className='startButton'>Start</button>
    </div>
  )
  
};

export default Start;