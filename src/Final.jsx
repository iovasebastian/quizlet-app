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

  const inputData = inputDataWrapper.inputData;

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

  return (
    <div>
      <div className='quizCard' onClick={reverseState}>
        <p className="p-afisare">{style}</p>
      </div>
      <div className="spread-apart">
        <button className = 'prevButton' onClick={handlePrev}>Previous</button>
        <button className = 'nextButton' onClick={handleNext}>Next</button> 
      </div>
    </div>
  );
};

export default Final;
