// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
const baseURL = "hhttps://server-quizlet.onrender.com/api/items/"; 


const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);

  const getExistingData = async () => {
    const response = await axios.get(baseURL);
    console.log(response);
    return response.data;
  };

  const handleDuplicates = async (inputData) => {
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
          // Handle the error as needed
        }
      }
    } catch (error) {
      console.error('Error handling duplicates:', error);
      // Handle the error as needed
    }
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
      for (const item of inputData) {
        if (item.question || item.answer) {
          const response = await axios.post(baseURL, {
            question: item.question,
            answer: item.answer,
          });
          console.log('Item added successfully:', response.data);
        }
      }
  
      // Fetch the final updated data after additions
      const addedDataResponse = await axios.get(baseURL);
      const addedData = addedDataResponse.data;
  
      // Update the input data with the added array
      setInputData(addedData);
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

  const navigateToFinal = async () => {
    await handleAddAllItems();
    await handleDuplicates(inputData);
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
