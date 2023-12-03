// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import { saveData, loadData } from './storage';
import './MainComponent.css';


const STORAGE_KEY = 'questionAnswerData';

const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);

  useEffect(() => {
    // Load data from local storage when the component mounts
    const savedData = loadData(STORAGE_KEY);
    if (savedData) {
      setInputData(savedData);
    }
  }, []);

  const addLine = () => {
    setInputData((prevData) => [...prevData, { question: '', answer: '' }]);
  };

  const removeLine = () => {
    setInputData((prevData) => {
      if (prevData.length > 0) {
        const updatedData = [...prevData];
        updatedData.pop();
        saveData(STORAGE_KEY, updatedData);
        return updatedData;
      } else {
        return prevData;
      }
    });
  };

  const handleInputComplete = (index, newData) => {
    setInputData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      saveData(STORAGE_KEY, updatedData);
      return updatedData;
    });
  };

  const elements = inputData.map((data, index) => (
    <LineComp
      key={index}
      initialQuestion={data.question}
      initialAnswer={data.answer}
      onInputComplete={(newData) => handleInputComplete(index, newData)}
    />
  ));

  const navigateToFinal = () => {
    console.log("Input data before navigation:", inputData);
    navigate('/final', { state: { inputData } });
  };

  return (
    <div className='background'>
      <div className='border'>
        {elements}
      </div>
      <button className='buttonAdd' onClick={addLine}>ADD</button>
      <button className='buttonRemove' onClick={removeLine}>REMOVE</button>
      {inputData.length>0&&<button className='buttonFinish' onClick={navigateToFinal}>Finish</button>}
    </div>
  );
};

export default MainComponent;
