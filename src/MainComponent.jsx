// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';

import { useNavigate, useLocation } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import loadingAnimation from './Rolling-1s-200px.svg';
import { set } from 'mongoose';
const baseURL = "https://server-three-taupe.vercel.app/api/items";
//const baseURL = "http://localhost:3000/api/items";


const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = JSON.parse(localStorage.getItem('role'));
  const [dataUpdated, setDataUpdated] = useState(false);
  const [questionSetTitle, setQuestionSetTitle] = useState('');
  const location = useLocation();
  const handleSaveItems = async (inputData,questionSetTitle) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Data to be sent:', inputData);
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
      console.log('Updated inputData:', updatedData);
      return updatedData;
    });
  };
  const deleteLine = async (index) => {
    setInputData((prevData) => {
      const updatedData = prevData.slice();
      updatedData.splice(index, 1);
      return updatedData;
    });
    setDataUpdated(!dataUpdated);
  };

  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem('myState'));
    setInputData(savedState.data.allQuestionSets);
    setQuestionSetTitle(savedState.data.title);
    console.log('enterpage')
  }, []);
  
    
  const elements = loading
  ? <img src={loadingAnimation} alt='loading-image' />
  :inputData.map((data, index) => (
    <div key={index} className="line-container">
      <LineComp
        key={index}
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
    navigate('/final', { state: { inputData } });
  };
  const navigateTest = async () =>{
    navigate('/test', {state: {inputData}});
  }
  const adminDash = () => {
    navigate('/admin');
  }
  const signOut = () => {
    navigate('/');
  }
  return (
    <div className='background'>
      <div className='container-main'>
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
