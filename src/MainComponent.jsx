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

  const handleDuplicates = async (inputData) => {
    const updatedData = [...inputData];
  
    for (let i = 0; i < updatedData.length; i++) {
      for (let j = i + 1; j < updatedData.length; j++) {
        if (
          updatedData[i].question === updatedData[j].question &&
          updatedData[i].answer === updatedData[j].answer
        ) {
          const itemIdToDelete = updatedData[i]._id; // Assuming the item has an "_id" property
  
          // Send DELETE request to your API endpoint with the item's ID
          try {
            await axios.delete(`'https://server-quizlet.onrender.com/api/items/'${itemIdToDelete}`)
            console.log(`Item with id ${itemIdToDelete} deleted successfully from the database.`);
          } catch (error) {
            console.error(`Error deleting item with id ${itemIdToDelete}:`, error);
            // Handle the error as needed
          }
  
          // Remove the item from the local state
          updatedData.splice(j, 1);
          j--;
        }
      }
    }
    
    setInputData(updatedData);
  };
  
  const handleRetrieveAll = async () => {
  try {
    // Get the existing data from the database and update the input data accordingly
    const existingData = await getExistingData();
    await handleDuplicates(inputData);
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
      // Use forEach instead of map to sequentially add items
      await inputData.reduce(async (previousPromise, item) => {
        await previousPromise;
  
        if (item.question || item.answer) {
          const response = await axios.post(baseURL, {
            question: item.question,
            answer: item.answer,
          });
          console.log('Item added successfully:', response.data);
        }
      }, Promise.resolve());
  
      // After all items are added, handle duplicates
      
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
