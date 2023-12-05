import { useState } from "react";
import { useLocation } from 'react-router-dom';
import './Final.css';
import { loadData } from './storage';

const Final = () => {
  const [state, setState] = useState(false);
  const [number, setNumber] = useState(0);
  const location = useLocation();
  let inputDataWrapper = location.state;

  if (!inputDataWrapper) {
    // If the state is not provided, try loading from local storage
    inputDataWrapper = { inputData: loadData('questionAnswerData') || [] };
  }

  const originalInputData = inputDataWrapper.inputData;
  const [inputData, setInputData] = useState([...originalInputData]);

  const style = state ? inputData[number].answer : inputData[number].question;

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
    const shuffledData = [...originalInputData];
    
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
