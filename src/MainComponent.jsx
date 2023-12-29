// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import loadingAnimation from './Rolling-1s-200px.svg';
const baseURL = "https://server-quizlet.onrender.com/api/items/";


const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getExistingData = async () => {
    const response = await axios.get(baseURL);
    console.log(response);
    return response.data;
  };

  const handleSaveItems = async (inputData) => {
    try {
      // Delete all of the existing items from the database
      await axios.delete(`${baseURL}`);

      // Insert the new items into the database
      for (const item of inputData) {
        try {
          await axios.post(baseURL, {
            question: item.question,
            answer: item.answer,
          });
        } catch (error) {
          console.error(`Error inserting item with question ${item.question} and answer ${item.answer}`, error);
        }
      }
    } catch (error) {
      console.error('Error handling duplicates:', error);
    }
  };

  const handleRetrieveAll = async () => {
    setLoading(true);
      try {
        const existingData = await getExistingData();
        existingData.forEach((item, index) => {
          setInputData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = item;
            return updatedData;
          });
        });
  
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving data:', error);
        setLoading(false);
      }
  };

  useEffect(() => {
      handleRetrieveAll();  
  }, []);

  const addLine = () => {
    setInputData((prevData) => [...prevData, { question: '', answer: '' }]);
  };

  const removeLine = () => {
    setInputData((prevData) => {
      if (prevData.length > 0) {
        const updatedData = [...prevData];
        updatedData.pop();
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
      return updatedData;
    });
  };

  let elements;
  {loading ? elements = <img src = {loadingAnimation} alt = 'loading-image'/> : elements = inputData.map((data, index) => (
    <LineComp
      key={index}
      initialQuestion={data.question}
      initialAnswer={data.answer}
      onInputComplete={(newData) => handleInputComplete(index, newData)}
    />
  ));
  }

  const saveItems = async () => {
    await handleSaveItems(inputData);
    alert("Data has been saved");
  }

  const navigateToFinal = async () => {
    navigate('/final', { state: { inputData } });
  };

  return (
    <div className='background'>
      <div className='container-main'>
        {elements}
        <button className='buttonAdd' onClick={addLine}>ADD</button>
        <button className='buttonRemove' onClick={removeLine}>REMOVE</button>
        <button className='buttonRemove' onClick={saveItems}>SAVE</button>
        {inputData.length > 0 && <button className='buttonFinish' onClick={navigateToFinal}>Finish</button>}
      </div>
    </div>
  );
};

export default MainComponent;
