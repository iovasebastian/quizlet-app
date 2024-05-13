// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';

import { useNavigate, useLocation } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import downArrow from './downarrow.svg';
import loadingAnimation from './Rolling-1s-200px.svg';
import { set } from 'mongoose';
const baseURL = "https://server-three-taupe.vercel.app/api/items";
//const baseURL = "http://localhost:3000/api/items";


const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const role = JSON.parse(localStorage.getItem('role'));
  const [dataUpdated, setDataUpdated] = useState(false);
  const [questionSetTitle, setQuestionSetTitle] = useState('');
  const location = useLocation();
  const handleSaveItems = async (inputData,questionSetTitle) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User not found.');
        return;
      }  
      await axios.post(`${baseURL}/saveForUser`, { inputData, questionSetTitle,user });
      const savedState = JSON.parse(sessionStorage.getItem('myState')) || { data: {} };
      savedState.data.allQuestionSets = inputData;
      sessionStorage.setItem('myState', JSON.stringify(savedState));
      alert("Data has been saved");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error saving data:', error);
    }
  };


  const addLine = () => {
    setInputData((prevData) => [...prevData, { questions: '', answers: '' }]);
    setDataUpdated(false);
  };

  const handleInputComplete = (index, newData) => {
    setInputData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };
  const deleteLine = async (index) => {
  
    // Use a functional update to ensure you're working with the most current state
    setInputData(prevData => {
      // Create a new array that filters out the item at the specified index
      const updatedData = prevData.filter((item, idx) => idx !== index);
      return updatedData;
    });
  
    // Toggle the update state to force a re-render or trigger effects
    setDataUpdated(prev => !prev);
  };
  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem('myState'));
    setInputData(savedState.data.allQuestionSets);
    setQuestionSetTitle(savedState.data.title);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > document.body.scrollHeight - 2000) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const elements = loading
  ? <img src={loadingAnimation} alt='loading-image' />
  :inputData.map((data, index) => (
    <div key={index} className="line-container">
      <LineComp
        key={data._id}
        index={index}
        initialQuestion={data.questions}
        initialAnswer={data.answers}
        onInputComplete={(newData) => handleInputComplete(index, newData)}
        deleteLine={() => deleteLine(index)}
      />
    </div>
  ));


  const saveItems = async () => {
    await handleSaveItems(inputData,questionSetTitle);
  }

  const navigateToFinal = async () => {
    saveItems();
    navigate('/final', { state: { inputData } });
    
  };
  const navigateTest = async () =>{
    saveItems();
    navigate('/test', {state: {inputData}});
  }
  const adminDash = () => {
    navigate('/admin');
  }
  const signOut = () => {
    navigate('/');
  }
  const goDown = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }
  return (
    <div className='background'>
      {showButton && <div className='buttonGoDown' onClick={goDown}><img className = 'arrowImg' src = {downArrow}/></div>}
      <div className='container-main'>
        <h1 className='titleMain'>{questionSetTitle}</h1>
        {elements}
        {!loading && <button className='activate buttonAdd' onClick={addLine}>ADD</button>}
        {!loading && <button className='activate buttonRemove' onClick={saveItems}>SAVE</button>}
        {role==='admin'&&<button className='activate buttonRemove' onClick={adminDash}>ADMIN</button>}
        {!loading && <button className='activate buttonRemove' onClick={signOut}>SIGN OUT</button>}
        {inputData.length > 0 && <button className='activate buttonFinish' onClick={navigateToFinal}>Finish</button>}
        {!loading && <button className='activate buttonRemove' onClick={navigateTest}>Test</button>}
      </div>
    </div>
  );
};

export default MainComponent;
