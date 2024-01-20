// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import LineComp from './LineComp';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';
import axios from 'axios';
import loadingAnimation from './Rolling-1s-200px.svg';
const baseURL = "https://server-quizlet.onrender.com/api/items";


const MainComponent = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = JSON.parse(localStorage.getItem('role'));

  const getExistingData = async () => {
    try{
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        return;
      }
      const response = await axios.get(`${baseURL}?username=${user.username}`);
      console.log('data from the db', response.data);
      return response.data;
    }
    catch(error){
      console.log(error);
    }
  };

  const handleSaveItems = async (inputData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Data to be sent:', inputData);
      if (!user) {
        console.error('User not found.');
        return;
      }
  
      const userItems = {
        username: user.username,
        questionSets: inputData.map(item => ({
          questions: [item.question],
          answers: [item.answer],
        })),
      };
  
      await axios.post(`${baseURL}/saveForUser`, { items: [userItems] });
      alert("Data has been saved");
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleRetrieveAll = async () => {
    setLoading(true);
    try {
      const existingData = await getExistingData();
      console.log('existing data', existingData);
  
      if (existingData && Array.isArray(existingData)) {
        const formattedData = existingData.map(item => ({
          question: item.questions && item.questions.length > 0 ? item.questions[0] : '',
          answer: item.answers && item.answers.length > 0 ? item.answers[0] : '',
          _id: item._id || '',
        }));
  
        setInputData(formattedData);
        console.log('input data', formattedData);
      }
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
      console.log('Updated inputData:', updatedData);
      return updatedData;
    });
  };
  const deleteLine = (index) => {
    setInputData((prevData) => {
      const updatedData = prevData.slice();
      updatedData.splice(index, 1);
      return updatedData;
    });
  };

  const deleteLine = async (index) => {
    setInputData((prevData) => {
      const updatedData = prevData.slice();
      updatedData.splice(index, 1);
      console.log('deleted index:', index);
      console.log('updatedData:', updatedData);
      return updatedData;
    });
    console.log('inputData:', inputData);
  };
  useEffect(() => {
    console.log('Updated inputData:', inputData);
  }, [inputData]);  
    
  const elements = loading
  ? <img src={loadingAnimation} alt='loading-image' />
  : inputData.map((data, index) => (
    <div key={index} className="line-container">
      <LineComp
        key={index} // Add key prop
        index={index}
        initialQuestion={data.question}
        initialAnswer={data.answer}
        onInputComplete={(newData) => handleInputComplete(index, newData)}
      />
      {!loading && <button className='buttonRemove' onClick={() => deleteLine(index)}>DELETE</button>}
    </div>
  ));

  const saveItems = async () => {
    await handleSaveItems(inputData);
  }

  const navigateToFinal = async () => {
    navigate('/final', { state: { inputData } });
  };
  const adminDash = () => {
    navigate('/admin');
  }
  const signOut = () => {
    navigate('/');
  }
  return (
    <div className='background'>
      <div className='container-main'>
        {elements}
        {!loading && <button className='buttonAdd' onClick={addLine}>ADD</button>}
        {!loading && <button className='buttonRemove' onClick={removeLine}>REMOVE</button>}
        {!loading && <button className='buttonRemove' onClick={saveItems}>SAVE</button>}
        {role==='admin'&&<button className='buttonRemove' onClick={adminDash}>ADMIN</button>}
        {!loading && <button className='buttonRemove' onClick={signOut}>SIGN OUT</button>}
        {inputData.length > 0 && <button className='buttonFinish' onClick={navigateToFinal}>Finish</button>}
      </div>
    </div>
  );
};

export default MainComponent;
