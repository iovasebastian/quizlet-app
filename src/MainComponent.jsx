import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate, useLocation } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import downArrow from './downarrow.svg';
import loadingAnimation from './Rolling-1s-200px.svg';
import { FiPlus } from "react-icons/fi";

//const baseURL = "http://localhost:3000/api/items";
const baseURL = "https://server-three-taupe.vercel.app/api/items";

const MainComponent = () => {
const navigate = useNavigate();
const [inputData, setInputData] = useState([]);
const [loading, setLoading] = useState(false);
const [showButton, setShowButton] = useState(false);
const role = JSON.parse(localStorage.getItem('role'));
const location = useLocation();
const questionSetId = localStorage.getItem("questionSetId");
const questionSetTitle = location?.state?.questionSetTitle;

useEffect(() => {
  const interval = setInterval(() => {
    saveItems();
  }, 300000);
  return () => clearInterval(interval);
}, [inputData]);

const handleSaveItems = async (inputData, questionSetId) => {
  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!userId) return;
    const response = await axios.post(`${baseURL}/saveForUser`, {
      inputData,
      questionSetId,
      userId
    });

    setInputData(response.data);
    triggerAnimation();
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

const handleRetreiveData = async (questionSetId) => {
  try {
    const response = await axios.get(`${baseURL}/retreiveQuestions`, {
      params: { questionSetId }
    });
    setInputData(response.data);
  } catch (e) {
    console.error(e);
  }
};

useEffect(() => {
  handleRetreiveData(questionSetId);
}, []);

useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY <= document.body.scrollHeight - 2000);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const addLine = () => {
  setInputData(prevData => [...prevData, { answerText: '', questionSetId: Number(questionSetId), questionText: '' }]);
};

const handleInputComplete = (index, newData) => {
  setInputData(prevData => prevData.map((item, i) => i === index ? { ...item, ...newData } : item));
};

const deleteLine = (indexToDelete) => {
  setInputData(prevData => prevData.filter((_, idx) => idx !== indexToDelete));
};

const elements = inputData.map((data, index) => (
  <LineComp
    key={data.questionId || `new-${index}`}
    index={index}
    initialQuestion={data.questionText}
    initialAnswer={data.answerText}
    onInputComplete={(newData) => handleInputComplete(index, newData)}
    deleteLine={() => deleteLine(index)}
  />
));

const saveItems = async () => {
  await handleSaveItems(inputData, questionSetId);
};

const triggerAnimation = () => {
  const saveBox = document.getElementById('saveBox');
  if (saveBox) {
    saveBox.classList.remove('animatedBox');
    void saveBox.offsetWidth;
    saveBox.classList.add('animatedBox');
  }
};

const navigateToFinal = async () => {
  try {
    await saveItems(); // still saves everything

    // Immediately fetch fresh data
    const response = await axios.get(`${baseURL}/retreiveQuestions`, {
      params: { questionSetId }
    });

    const refreshedData = response.data;
    navigate('/final', { state: { inputData: refreshedData } });

  } catch (err) {
    console.error("Save or fetch failed", err);
  }
};

const navigateTest = async () => {
  await saveItems();
  navigate('/numberpicker', { state: { inputData } });
};

const goDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

return (
  <div className='background'>
    <div id="saveBox" className='simpleBox'>
      <p>Items saved!</p>
    </div>
    {showButton && <div className='buttonGoDown' onClick={goDown}><img className='arrowImg' src={downArrow} alt="Go Down" /></div>}
    <div className='container-main'>
      <h1 className='titleMain'>{questionSetTitle}</h1>
      {elements}
      {!loading && (
        <button className="activate buttonAdd" onClick={addLine}>
          <FiPlus size={24} />
        </button>
      )}
      <div className='buttonsDivMain'>
        {!loading && <button className='activate buttonRemove' onClick={saveItems}>Save</button>}
        {!loading && <button className='activate buttonRemove' onClick={navigateTest}>Test</button>}
        {inputData.length > 0 && <button className='activate buttonFinish' onClick={navigateToFinal}>Finish</button>}
      </div>
    </div>
  </div>
);
};

export default MainComponent;
