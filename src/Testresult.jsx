import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './testresult.css';

const Testresult = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState(0);
    useEffect(() => {
        setCorrectAnswer(location.state.correctQuestions);
        setWrongAnswer(location.state.wrongQuestions);
    }, []);
    const goBack = () =>{
        navigate('/main');
    }
    
    return(
        <div className='backgroundResult'>
            <div className='containerResult'>
                <h1 className='titluResult'>Test Results</h1>
                <div className='answerBox'>
                    <p className='correctAnswer'>Correct answers : {correctAnswer}</p>
                    <p className='wrongAnswer'>Wrong answers : {wrongAnswer}</p>
                </div>
                <h1 className='percentResult'>That's {(correctAnswer/10)*100}%</h1>
                <button onClick = {()=>goBack()} className='buttonBack'>Go back</button>
            </div>
        </div>
    )
}
export default Testresult;