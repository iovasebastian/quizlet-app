import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactSlider from 'react-slider';
import './questionNumberPicker.css';
import RequireAuth from "../RequireAuth/RequireAuth";
const QuestionNumberPicker = () =>{
    const location = useLocation();
    const [numberOfQuestions, setNumberOfQuestions] = useState(1);
    const [inputData, setInputData] = useState([]);
    const navigate = useNavigate();
    useEffect(() =>{
        setInputData(location.state.inputData);
    },[location.state.inputData]);
    const handleChange = (e) =>{
        setNumberOfQuestions(e);
    }
    const navigateTest = () =>{
        navigate("/test",  { state: { inputData, numberOfQuestions } });
    }
    return(
        <>
        <RequireAuth />
        <div className="bodyQuestionPicker">
            <div className="containerQuestionPicker">
                <h1 className="titluCentru">Pick how many questions do u want the test to have</h1>
                <div className="sliderContainer">
                    <ReactSlider
                        className="horizontalSlider"
                        thumbClassName="exampleThumb"
                        trackClassName="exampleTrack"
                        value={numberOfQuestions}
                        onChange={handleChange}
                        min={1}
                        max={inputData.length}
                    />
                </div>
                <div className="buttonsPicker">
                    <div className = "buttonNumberPicker" onClick={() => setNumberOfQuestions(Math.min(10,inputData.length))}>10</div>
                    <div className = "buttonNumberPicker" onClick={() => setNumberOfQuestions(Math.min(20,inputData.length))}>20</div>
                    <div className = "buttonNumberPicker" onClick={() => setNumberOfQuestions(inputData.length)}>All</div>
                </div>
                <h3 className="textQuestionPicker">Number of questions that will appear in the test : {numberOfQuestions}</h3>
                <button className = "buttonNumberPicker marginBottom" onClick={navigateTest}>Go to test</button>
            </div>
        </div>
        </>
    )
}
export default QuestionNumberPicker;