import './MainComponent.css';
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import { saveData, loadData } from './storage';

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

  const handleInputComplete = (index, newData) => {
    setInputData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = newData;
      // Save the updated data to local storage
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
    <div>
      <div className='border'>
        {elements}
      </div>
      <button onClick={addLine}>Add</button>
      <button onClick={navigateToFinal}>Finish</button>
    </div>
  );
};

export default MainComponent;
