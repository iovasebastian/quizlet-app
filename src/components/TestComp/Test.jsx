import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RequireAuth from '../RequireAuth/RequireAuth';
import './test.css';
const Test = () =>{
    const [inputData, setInputData] = useState([]);
    const [randomQuestion, setRandomQuestion] = useState("");
    const [randomQuestionAnswer, setRandomQuestionAnswer] = useState("");
    const [copyArray, setCopyArray] = useState([]);
    const [questionNumer, setQuestionNumber] = useState(1);
    const [correctQuestions, setCorrectQuestions] = useState(0);
    const [wrongQuestions, setWrongQuestions] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [longTextBool, setLongTextBool] = useState(false);
    const [rightQuestionPos, setRightQuestionPos] = useState(0);
    const [numberOfQuestions, setNumberOfQuestions] = useState(100);
    const [buttonStyles, setButtonStyles] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    let randomQuestionIndex;

    useEffect(() => {
        setInputData(location.state.inputData);
        setNumberOfQuestions(location.state.numberOfQuestions);
    }, [location.state.inputData, location.state.numberOfQuestions]);

    useEffect(()=>{
        console.log('inputdata', inputData)
    }, [inputData])

    useEffect(() => {
        if (inputData.length > 0) {
            const checkedNumbers = new Set();
            const newCopyArray = [];

            while (newCopyArray.length < numberOfQuestions) {
                const newPosition = getRandomIntInclusive(0, inputData.length - 1);
                if (!checkedNumbers.has(newPosition)) {
                    checkedNumbers.add(newPosition);
                    newCopyArray.push(newPosition);
                }
            }
            newCopyArray.push(0);
            setCopyArray(newCopyArray);
        }
    }, [inputData]);
    useEffect(() => {
        setRightQuestionPos(getRandomIntInclusive(1, 4));
        setButtonStyles({});
        if (inputData.length > 0 && copyArray.length > 0) {
            let arrayLength = inputData.length;
            randomQuestionIndex = copyArray[questionNumer-1];
            setRandomQuestion(inputData[randomQuestionIndex].questionText);
            setRandomQuestionAnswer(inputData[randomQuestionIndex].answerText);
            
            let newAnswers = new Array(4).fill("");
    
            // Populate the new answers array
            newAnswers.forEach((_, i) => {
                if (i + 1 === rightQuestionPos) {
                    newAnswers[i] = inputData[randomQuestionIndex].answerText;  // Direct assignment for correct position
                } else {
                    let position;
                    do {
                        position = getRandomIntInclusive(0, arrayLength - 1);  // Correctly adjusted to avoid the same index
                    } while (position === randomQuestionIndex);  // Ensure different question
                    newAnswers[i] = inputData[position].answerText;
                }
            });
    
            setAnswer(newAnswers);  // Update the state to trigger re-render
            
        }
    }, [inputData,copyArray, questionNumer, rightQuestionPos]);
    useEffect(() => {
        if(questionNumer === numberOfQuestions + 1)navigateResult();
    },[questionNumer]);
    
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function validateAnswer(number) {
        const isCorrect = number === rightQuestionPos;
        setButtonStyles({
            ...buttonStyles,
            [rightQuestionPos]: 'green',
            [number]: isCorrect ? 'green' : 'red'
        });
        if (isCorrect) {
            setCorrectQuestions(prev => prev + 1);
        } else {
            setWrongQuestions(prev => prev + 1);
        }

        setTimeout(() => {
            setQuestionNumber(prev => prev + 1);
        }, 1000);
    }
    
    
    const navigateResult = () =>{
        navigate('/testresult', {state:{correctQuestions,wrongQuestions, numberOfQuestions}});
    }

    return(
        <>
        <RequireAuth />
        <div className='backgroundTest'>
            <div id = "saveBox" className='simpleBox'>
                <p>Items saved!</p>
            </div>
            <div className='containerTest'>
                <div className='questionArea'>
                    <p className='questionNumber'>{questionNumer}/{numberOfQuestions}</p>
                    <p className='correctQuestion'>{correctQuestions}</p>
                    <p className='wrongQuestion'>{wrongQuestions}</p>
                    <h1 className='h1Question'>{randomQuestion}</h1>
                </div>
                <div className='answersArea'>
                {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className='buttonAnswer'
                            onClick={() => validateAnswer(index)}
                            style={{ backgroundColor: buttonStyles[index] }}
                        >
                            <div className="answerText">
                                {answer[index - 1] ? (
                                    <div>
                                        {answer[index-1]}
                                    </div>
                                ) : (
                                    <div>Empty</div>
                                )}
                            </div> 
                        </div>
                    ))}
                </div>
                

            </div>
        </div>
        </>
    )
}
export default Test;