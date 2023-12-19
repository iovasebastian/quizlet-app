// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
const baseURL = "https://server-quizlet.onrender.com/api/items";

const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);

  const getExistingData = async () => {
    const response = await axios.get(baseURL);
    console.log(response);
    return response.data;
  };
  const handleRetrieveAll = async () => {
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
    } catch (error) {
      console.error('Error deleting entries:', error);
    }
  };

  useEffect(() => {
    handleRetrieveAll();
    handleDuplicates(inputData);
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

  const handleDuplicates = (inputData) => {
    console.log('Items before deletion', inputData);
      const updatedData = [...inputData];
      for (let i = 0; i < updatedData.length; i++) {
        for (let j = i + 1; j < updatedData.length; j++) {
          if (
            updatedData[i].question === updatedData[j].question &&
            updatedData[i].answer === updatedData[j].answer
          ) {
            updatedData.splice(j, 1);
            j--; // Decrement j to account for the removed item
          }
        }
      }
      setInputData(updatedData);
  }

  const handleAddAllItems = async () => {
    try {
      await Promise.all(inputData.map(async (item) => {

        if (item.question || item.answer) {
          const response = await axios.post(baseURL, {
            question: item.question,
            answer: item.answer,
          });
          console.log('Item added successfully:', response.data);
        }
      }));
    } catch (error) {
      console.error('Error adding items:', error);
      // Handle the error as needed
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
