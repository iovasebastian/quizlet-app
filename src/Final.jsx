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

  const style = state ? inputData[number].question : inputData[number].answer;

  function reverseState() {
    setState((prevState) => !prevState);
  }

  function handleNext() {
    setNumber((prevNumber) => (prevNumber < inputData.length - 1 ? prevNumber + 1 : 0));
  }

  function handlePrev() {
    setNumber((prevNumber) => (prevNumber > 0 ? prevNumber - 1 : inputData.length - 1));
  }

  return (
    <div>
      <div className='quizCard' onClick={reverseState}>
        <p>{style}</p>
      </div>
      <div>
        <button onClick={handleNext}>Next</button>
        <button onClick={handlePrev}>Previous</button>
      </div>
    </div>
  );
};

export default Final;
