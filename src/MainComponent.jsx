import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate, useLocation } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import downArrow from './downarrow.svg';
import loadingAnimation from './Rolling-1s-200px.svg';

const baseURL = "https://server-three-taupe.vercel.app/api/items";
//const baseURL = "http://localhost:3000/api/items";

const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const role = JSON.parse(localStorage.getItem('role'));
  const [questionSetTitle, setQuestionSetTitle] = useState('');
  const location = useLocation();

  const handleSaveItems = async (inputData, questionSetTitle) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('User not found.');
        return;
      }
      await axios.post(`${baseURL}/saveForUser`, { inputData, questionSetTitle, user });
      const savedState = JSON.parse(sessionStorage.getItem('myState')) || { data: {} };
      savedState.data.allQuestionSets = inputData;
      sessionStorage.setItem('myState', JSON.stringify(savedState));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error saving data:', error);
    }
  };

  const addLine = () => {
    setInputData((prevData) => [...prevData, { _id: Date.now().toString(), questions: '', answers: '' }]);
  };

  const handleInputComplete = (id, newData) => {
    setInputData((prevData) => prevData.map(item => item._id === id ? newData : item));
  };

  const deleteLine = (id) => {
    setInputData((prevData) => prevData.filter(item => item._id !== id));
  };

  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem('myState'));
    if (savedState && savedState.data) {
      setInputData(savedState.data.allQuestionSets || []);
      setQuestionSetTitle(savedState.data.title || '');
      const allQuestionId = savedState.data._id;
      const allQuestionIdJSON = JSON.stringify(allQuestionId);
      localStorage.setItem('allQuestionId', allQuestionIdJSON);
    }
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
    ? <img src={loadingAnimation} alt='loading' />
    : inputData.map((data, index) => (
        <div key={data._id} className="line-container">
          <LineComp
            key={data._id}
            id={data._id}
            index={index}
            initialQuestion={data.questions}
            initialAnswer={data.answers}
            onInputComplete={(newData) => handleInputComplete(data._id, newData)}
            deleteLine={() => deleteLine(data._id)}
          />
        </div>
      ));

  const saveItems = async () => {
    await handleSaveItems(inputData, questionSetTitle);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    const saveBox = document.getElementById('saveBox');
    if (saveBox) {
      saveBox.classList.remove('animatedBox');
      void saveBox.offsetWidth; // Reflow for restarting animation
      saveBox.classList.add('animatedBox');
    } else {
      console.error("saveBox doesn't exist.");
    }
  };

  const navigateToFinal = async () => {
    await saveItems();
    navigate('/final', { state: { inputData } });
  };

  const navigateTest = async () => {
    await saveItems();
    navigate('/test', { state: { inputData } });
  };

  const adminDash = () => {
    navigate('/admin');
  };

  const signOut = () => {
    navigate('/');
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
        {!loading && <button className='activate buttonAdd' onClick={addLine}>ADD</button>}
        {!loading && <button className='activate buttonRemove' onClick={saveItems}>SAVE</button>}
        {role === 'admin' && <button className='activate buttonRemove' onClick={adminDash}>ADMIN</button>}
        {!loading && <button className='activate buttonRemove' onClick={signOut}>SIGN OUT</button>}
        {inputData.length > 0 && <button className='activate buttonFinish' onClick={navigateToFinal}>Finish</button>}
        {!loading && <button className='activate buttonRemove' onClick={navigateTest}>Test</button>}
      </div>
    </div>
  );
};

export default MainComponent;
