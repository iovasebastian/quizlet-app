import React, { useState, useEffect, useRef } from 'react';
import LineComp from '../LineComp/LineComp';
import { useNavigate, useLocation } from 'react-router-dom';
import './MainComponent.css';
import axios from "../../utils/axiosInstance";
import downArrow from '../../Svgs/downarrow.svg';
import loadingAnimation from '../../Svgs/Rolling-1s-200px.svg';
import { FiPlus } from "react-icons/fi";
import RequireAuth from '../RequireAuth/RequireAuth';
import { FlatTree } from 'framer-motion';

const baseURL = process.env.REACT_APP_BASE_URL

const MainComponent = () => {
const navigate = useNavigate();
const [inputData, setInputData] = useState([]);
const [loading, setLoading] = useState(false);
const [showButton, setShowButton] = useState(false);
const role = localStorage.getItem('role');
const location = useLocation();
const token = localStorage.getItem("token");
const questionSetId = localStorage.getItem("questionSetId");
const questionSetTitle = location?.state?.questionSetTitle;
const incrementedEntry = useRef(false);
const [saveButtonLoading, setSaveButtonLoading] = useState(false);
const [finishButtonLoading, setFinishButtonLoading] = useState(false);
const [testButtonLoading, setTestButtonLoading] = useState(false);
const [imageButtonLoading, setImageButtonLoading] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    saveItems();
  }, 300000);
  return () => clearInterval(interval);
}, [inputData]);



useEffect(()=>{
  if(!incrementedEntry.current){
    incrementEntryInDb();
  }
  incrementedEntry.current = true;
},[])

const incrementEntryInDb = async () =>{
  try{
    await axios.post(`${baseURL}/addEntryToDb`,{
      questionSetId:questionSetId
    },{
      headers: {Authorization : `Bearer ${token}`}
    })
  }catch(error){
    console.error(error);
  }
}

const handleSaveItems = async (inputData, questionSetId) => {
  try {
    const response = await axios.post(`${baseURL}/saveForUser`, {
      inputData,
      questionSetId
    },{
      headers: {Authorization : `Bearer ${token}`}
    });

    setInputData(response.data);
    triggerAnimation();
  } catch (error) {
    setSaveButtonLoading(false);
    setTestButtonLoading(false);
    setFinishButtonLoading(false);
    setImageButtonLoading(false);
    console.error('Error saving data:', error);
  }
};

const handleRetreiveData = async (questionSetId) => {
  setLoading(true);
  try {
    const response = await axios.get(`${baseURL}/retreiveQuestions`, {
      headers: {Authorization : `Bearer ${token}`},
      params: { questionSetId }
    });
    setInputData(response.data);
    setLoading(false)
  } catch (e) {
    console.error(e);
    setLoading(false)
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
  const newLine = {
    questionText: '',
    answerText: '',
    questionSetId: Number(questionSetId),
    tempId: Date.now()
  };
  setInputData(prevData => [...prevData, newLine]);
  console.log('newLine', newLine)
};

const handleInputComplete = (index, newData) => {
  setInputData(prevData => prevData.map((item, i) => i === index ? { ...item, ...newData } : item));
};

const deleteLine = (id) => {
  console.log('id', id)
  setInputData(prev => {
    const hasQuestionId = prev.some(item => item.questionId === id);
    const hasTempId = prev.some(item => item.tempId === id);

    if (hasQuestionId) {
      return prev.filter(item => item.questionId !== id);
    } else if (hasTempId) {
      return prev.filter(item => item.tempId !== id);
    }

    return prev;
  });
};

const elements = inputData.map((data, index) => (
  <LineComp
    key={data.questionId || data.tempId}
    index={index}
    initialQuestion={data.questionText}
    initialAnswer={data.answerText}
    onInputComplete={(newData) => handleInputComplete(index, newData)}
    deleteLine={() => deleteLine(data.questionId || data.tempId)}
  />
));

const saveItems = async () => {
  await handleSaveItems(inputData, questionSetId);
};

const saveItemsButton = async () =>{
  setSaveButtonLoading(true);
  await handleSaveItems(inputData, questionSetId);
  setSaveButtonLoading(false);
}

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
    setFinishButtonLoading(true);
    await saveItems(); // still saves everything

    // Immediately fetch fresh data
    const response = await axios.get(`${baseURL}/retreiveQuestions`, {
      headers: {Authorization : `Bearer ${token}`},
      params: { questionSetId }
    });

    const refreshedData = response.data;
    setFinishButtonLoading(false);
    navigate('/final', { state: { inputData: refreshedData } });

  } catch (err) {
    setFinishButtonLoading(false);
    console.error("Save or fetch failed", err);
  }
};

const navigateTest = async () => {
  setTestButtonLoading(true);
  await saveItems();
  setTestButtonLoading(false);
  navigate('/numberpicker', { state: { inputData } });
};

const navigateImg2Text = async () =>{
  setImageButtonLoading(true);
  await saveItems();
  setImageButtonLoading(false)
  navigate('/img2text', { state: { questionSetId }})
}

const goDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

return (
  <>
  <RequireAuth />
  <div className='background'>
    <div id="saveBox" className='simpleBox'>
      <p>Items saved!</p>
    </div>
    {showButton && <div className='buttonGoDown' onClick={goDown}><img className='arrowImg' src={downArrow} alt="Go Down" /></div>}
    <div className='container-main'>
      <h1 className='titleMain'>{questionSetTitle}</h1>
      {loading && <img src = {loadingAnimation}/>}
      {elements}
      {!loading && (
        <button className="activate buttonAdd" onClick={addLine}>
          <FiPlus size={24} />
        </button>
      )}
      <div className='buttonsDivMain'>
        {!loading && <button className='activate buttonBottomOfMain' onClick={saveItemsButton}>
                      <span className={`${saveButtonLoading ? 'hidden' : ''}`}>
                        Save
                      </span>
                      <img
                        className={`imageLoadingMain ${saveButtonLoading ? 'visible' : ''}`}
                        src={loadingAnimation}
                        alt=""
                      />
                     </button>}
        {!loading && <button className='activate buttonBottomOfMain' onClick={navigateTest}>
                      <span className={`${testButtonLoading ? 'hidden' : ''}`}>
                        Test
                      </span>
                      <img
                        className={`imageLoadingMain ${testButtonLoading ? 'visible' : ''}`}
                        src={loadingAnimation}
                        alt=""
                      />
                      </button>}
        {!loading && <button className='activate buttonBottomOfMain' onClick={navigateImg2Text}>
                      <span className={`${imageButtonLoading ? 'hidden' : ''}`}>
                        Get questions from image
                      </span>
                      <img
                        className={`imageLoadingMain ${imageButtonLoading ? 'visible' : ''}`}
                        src={loadingAnimation}
                        alt=""
                      />
                      </button>}
        {inputData.length > 0 && <button className='activate buttonBottomOfMain' onClick={navigateToFinal}>
                      <span className={`${finishButtonLoading ? 'hidden' : ''}`}>
                        Finish
                      </span>
                      <img
                        className={`imageLoadingMain ${finishButtonLoading ? 'visible' : ''}`}
                        src={loadingAnimation}
                        alt=""
                      />
                      </button>}
      </div>
    </div>
  </div>
  </>
);
};

export default MainComponent;
