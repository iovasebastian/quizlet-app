import { useState, useEffect } from "react";
import { useLocation, useMatch } from 'react-router-dom';
import axios from 'axios';
import './Final.css';

const Final = () => {
  const [state, setState] = useState(false);
  const [number, setNumber] = useState(0);
  const [inputData, setInputData] = useState([]);
  const baseURL = "https://server-quizlet.onrender.com/api/items";
  const fetchData = async (username) => {
    try {
      const response = await axios.get(`${baseURL}?username=${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          return;
        }

        const data = await fetchData(user.username);

        // Filter out invalid or empty objects from the data array
        const filteredData = data.filter(item => Object.keys(item).length > 0);

        setInputData(filteredData);
        console.log('init', filteredData);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeData();
  }, []); // Dependency array ensures this effect runs when the component mounts or when inputDataWrapper changes
  
  
  console.log('input', inputData);
  const currentQuestion = inputData[number]?.questions?.[0] ?? '';
  const currentAnswer = inputData[number]?.answers?.[0] ?? '';
  
  console.log(currentQuestion,currentAnswer);
  const style = state ? currentAnswer : currentQuestion;

  function reverseState() {
    setState((prevState) => !prevState);
  }

  function handleNext() {
    setNumber((prevNumber) => (prevNumber < inputData.length - 1 ? prevNumber + 1 : 0));
    setState(false);
  }
  
  function handlePrev() {
    setNumber((prevNumber) => (prevNumber > 0 ? prevNumber - 1 : inputData.length - 1));
    setState(false);
  }
  

  function shuffle() {
  const shuffledData = [...inputData];

  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }

  setInputData(shuffledData);
  setNumber(0); // Reset the number to start from the beginning
}

  
  

  return (
    <div className="cover-final">
      <div className="all-card">
        <div className='quizCard' onClick={reverseState}>
          <p className="p-afisare">{style}</p>
        </div>
        <div className="spread-apart">
          <button className='prevButton' onClick={handlePrev}>Previous</button>
          <button className='shuffleButton' onClick={shuffle}>Shuffle</button>
          <button className='nextButton' onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Final;
