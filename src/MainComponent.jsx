// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import { saveData, loadData } from './storage';
import './MainComponent.css';
import axios from 'axios';
const baseURL = 'https://eloquent-griffin-4ccdd9.netlify.app/.netlify/functions/server';

const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);

  const getExistingData = async () => {
    const response = await axios.get(baseURL);
    return response.data;
  };
  const handleDeleteAll = async () => {
    try {
      // Get the existing data from the database and update the input data accordingly
      const existingData = await getExistingData();
      existingData.forEach((item, index) => {
        setInputData((prevData) => {
          const updatedData = [...prevData];
          updatedData[index] = item;
          return updatedData;
        });
      });

      // Proceed with deletion
      const deleteResponse = await axios.delete(baseURL);
      console.log('Delete response:', deleteResponse.data);

      // Handle the response as needed
    } catch (error) {
      console.error('Error deleting entries:', error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    handleDeleteAll();
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

  const handleAddAllItems = async () => {
    try {
      await Promise.all(inputData.map(async (item) => {
        if (item.question || item.answer) {
          const response = await axios.post(baseURL, item);
          console.log('Item added successfully:', response.data);
        }
      }));
    } catch (error) {
      console.error('Error adding items:', error);
    }
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
    handleAddAllItems();
    navigate('/final', { state: { inputData } });
  };

  return (
    <div className='background'>
      <div className='container-main'>
        {elements}
        <button className='buttonAdd' onClick={addLine}>ADD</button>
        <button className='buttonRemove' onClick={removeLine}>REMOVE</button>
        {inputData.length > 0 && <button className='buttonFinish' onClick={navigateToFinal}>Finish</button>}
      </div>
    </div>
  );
};

export default MainComponent;
