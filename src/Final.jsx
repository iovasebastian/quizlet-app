import { useState, useEffect } from "react";
import { useLocation, useMatch } from 'react-router-dom';
import axios from 'axios';
import './Final.css';

const Final = () => {
  const [state, setState] = useState(false);
  const [number, setNumber] = useState(0);
  const [inputData, setInputData] = useState([]);
  const [editState, setEditState] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [index, setIndex] = useState();
  const username = JSON.parse(localStorage.getItem('user'));
  const savedState = JSON.parse(sessionStorage.getItem('myState'));
  const userId = username._id;
  const allQuestionId = savedState.data._id;
  console.log('USERID', userId);
  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  //const baseURL = "http://localhost:3000/api/items";
  const location = useLocation();
  useEffect(() => {
   setInputData(location.state.inputData);  
   setIndex(localStorage.getItem('indexSet'));
  }, []);
  
  console.log('input', inputData);
  const currentQuestion = inputData[number]?.questions;
  const currentAnswer = inputData[number]?.answers;
  const _id = inputData[number]?._id;
  console.log('ID',_id);
  console.log(currentQuestion,currentAnswer);
  const style = state ? currentAnswer : currentQuestion;

  function reverseState(e) {
    if(!editState){
      setState(prevState => !prevState);
    }
    setInputWord(style);
  }

  function handleNext() {
    setNumber((prevNumber) => (prevNumber < inputData.length - 1 ? prevNumber + 1 : 0));
    setState(false);
    console.log('INDEX',index)
  }
  
  function handlePrev() {
    setNumber((prevNumber) => (prevNumber > 0 ? prevNumber - 1 : inputData.length - 1));
    setState(false);
  }
  const changeEditState = async () => {
    console.log('editing');
    if (!editState) {
      setEditState(true);
      setInputWord(style);
    } else {
      try {
        const response = await axios.post(`${baseURL}/saveEdit`, {
          _id: userId,
          item: inputWord,
          questionSetId: _id,
          allQuestionId: allQuestionId,
          state: state
        });
  
        if (response.status === 200) {
          console.log('Save successful:', response.data);

          const updatedData = inputData.map((item, index) => {
            if(index === number){
              console.log('item question', item.questions);
              state ? item.answers = inputWord : item.questions = inputWord;
            } 
            return item;
          });
  
          setInputData(updatedData);
        } else {
          console.error('Failed to save changes:', response.status);
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
      setEditState(false);
    }
  };
  
  const handleInputChange = (e) =>{
    setInputWord(e.target.value);
  }


  function shuffle() {
  const shuffledData = [...inputData];

  for (let i = shuffledData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
  }

  setInputData(shuffledData);
  setNumber(0);
}

  
  

  return (
    <div className="cover-final">
      <div className="all-card">
        <div className='quizCard' onClick={reverseState}>
          {editState ? <input className="p-afisare" value = {inputWord} onChange={handleInputChange}/> : <p className="p-afisare">{style}</p>}
          <p className="p-numbering">{number+1}/{inputData.length}</p>
        </div>
        <div className="spread-apart">
          <button className='prevButton' onClick={handlePrev}>Previous</button>
          <button className='shuffleButton' onClick={shuffle}>Shuffle</button>
          <button className='nextButton' onClick={handleNext}>Next</button>
          <button className="nextButton" onClick={changeEditState}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default Final;
