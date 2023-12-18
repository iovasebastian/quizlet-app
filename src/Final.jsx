import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Final.css';

const Final = () => {
  const [state, setState] = useState(false);
  const [number, setNumber] = useState(0);
  const location = useLocation();
  const inputDataWrapper = location.state;
  const [inputData, setInputData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://server-quizlet.onrender.com/api/items');
        setInputData(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!inputDataWrapper) {
      // If the state is not provided, fetch data from the database
      fetchData();
      
    } else {
      // If the state is provided, use it
      setInputData(inputDataWrapper.inputData || []);
    }
  }, [inputDataWrapper]); // Dependency array ensures this effect runs when the component mounts or when inputDataWrapper changes

  const currentItem = inputData[number];
  const style = state ? currentItem?.answer : currentItem?.question;

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

    let currentIndex = shuffledData.length, randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledData[currentIndex], shuffledData[randomIndex]] = [
        shuffledData[randomIndex], shuffledData[currentIndex]
      ];
    }

    setInputData(shuffledData);
    for(let i = 0;i<shuffledData.length;i++){
      console.log(shuffledData[i]);
    }
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
