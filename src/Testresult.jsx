import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import './testresult.css';

const Testresult = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(0);
    useEffect(() => {
        setCorrectAnswer(location.state.correctQuestions);
        setWrongAnswer(location.state.wrongQuestions);
        setQuestionNumber(location.state.numberOfQuestions);
    }, []);
    const goBack = () =>{
        navigate('/main');
    }
    
    return(
        <>
        <RequireAuth />
        <div className='backgroundResult'>
            <div className='containerResult'>
                <h1 className='titluResult'>Test Results</h1>
                <div className='answerBox'>
                    <p className='correctAnswer'>Correct answers : {correctAnswer}</p>
                    <p className='wrongAnswer'>Wrong answers : {wrongAnswer}</p>
                </div>
                <h1 className='percentResult'>That's {((correctAnswer / questionNumber) * 100).toFixed(2)}%</h1>
                <button onClick = {()=>goBack()} className='buttonBack'>Go back</button>
            </div>
        </div>
        </>
    )
}
export default Testresult;