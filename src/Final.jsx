import { useState, useEffect } from "react";
import { useLocation, useMatch } from 'react-router-dom';
import axios from 'axios';
import './Final.css';
import RequireAuth from "./RequireAuth";

const Final = () => {
  const [state, setState] = useState(false);
  const [number, setNumber] = useState(0);
  const [inputData, setInputData] = useState([]);
  const [editState, setEditState] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [index, setIndex] = useState();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const questionSetId = localStorage.getItem("questionSetId");

  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  //const baseURL = "http://localhost:3000/api/items";
  useEffect(() => {
   setInputData(location.state.inputData);  
   setIndex(localStorage.getItem('indexSet'));
  }, []);

  const currentQuestion = inputData[number]?.questionText;
  const currentAnswer = inputData[number]?.answerText;
  const questionId = inputData[number]?.questionId;
  console.log('ID',questionId);
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
  const changeEditState = async (e) => {
    e.stopPropagation();
    console.log('editing');
    if (!editState) {
      setEditState(true);
      setInputWord(style);
    } else {
      try {
        const response = await axios.post(`${baseURL}/saveEdit`, {
          item: inputWord,
          questionId: questionId,
          state: state
        },{
          headers: {Authorization : `Bearer ${token}`}
        });
  
        if (response.status === 200) {
          console.log('Save successful:', response.data);

          const updatedData = inputData.map((item, index) => {
            if(index === number){
              console.log('item question', item.questionText);
              state ? item.answerText = inputWord : item.questionText = inputWord;
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
    <>
    <RequireAuth />
    <div className="cover-final">
      <div id = "saveBox" className='simpleBox'>
          <p>Items saved!</p>
      </div>
      <div className="all-card">
        <div className='quizCard' onClick={reverseState}>
          <div className="topDivFinal">
            <p className="p-numbering">{number+1}/{inputData.length}</p>
            <button className="buttonEdit" onClick={changeEditState}>{editState?"Done":"Edit"}</button>   
          </div>
          <div
            className="textDivFinal"
            style={{
              alignItems: style?.length < 100 ? "center" : "flex-start"
            }}
          >
            {editState ? <input className="p-afisare" value = {inputWord} onChange={handleInputChange}/> : <p>{style}</p>}
          </div>
        </div>
        <div className="spread-apart">
          <button className='buttonFinal' onClick={handlePrev}>Previous</button>
          <button className='buttonFinal' onClick={shuffle}>Shuffle</button>
          <button className='buttonFinal' onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Final;
