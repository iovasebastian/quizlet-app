import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './testresult.css';

const Testresult = () =>{
    const location = useLocation();
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState(0);
    useEffect(() => {
        setCorrectAnswer(location.state.correctQuestions);
        setWrongAnswer(location.state.wrongQuestions);
    }, []);
    return(
        <div className='backgroundResult'>
            <div className='containerResult'>
                <h1 className='titluResult'>Test Results</h1>
                <div className='answerBox'>
                    <p className='correctAnswer'>Correct answers : {correctAnswer}</p>
                    <p className='wrongAnswer'>Wrong answers : {wrongAnswer}</p>
                </div>
                <h1 className='percentResult'>That's {(correctAnswer/10)*100}%</h1>
            </div>
        </div>
    )
}
export default Testresult;