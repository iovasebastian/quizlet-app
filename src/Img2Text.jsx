import './img2text.css';
import RequireAuth from './RequireAuth';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "./utils/axiosInstance"; 
import { createWorker } from 'tesseract.js';
const Img2Text = () =>{
    const [file, setFile] = useState(null);
    const [ocrText, setOcrText] = useState('');
    const [qaPairs, setQaPairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [numberOfQuestions, setNumberOfQuestions] = useState(1);
    const MAX_NUMBER_QUESTIONS = 5;
    const questionSetId = location.state.questionSetId;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const baseURL = "https://server-three-taupe.vercel.app/api/items";
    //const baseURL = "http://localhost:3000/api/items";

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setOcrText('');
        setQaPairs([]);
        setError(null);
    };

    const runOCR = async (file) => {
        const worker = await createWorker('eng');

        const {
            data: { text }
        } = await worker.recognize(file);

        await worker.terminate();
        return text;
    };

    const handleNumberOfQuestions = (e) => {
        setNumberOfQuestions(e.target.value);
    }

    const saveQuestionsToSet = async () => {
        try{
            const response = await axios.post(`${baseURL}/ocr-upload`, 
            {qaPairs, questionSetId},{
            headers: {Authorization : `Bearer ${token}`}
        });
            console.log(response.data);
            navigate('/main');
        }catch(e){
            console.error(e);
        }     
    }

    const handleUpload = async () => {
        if (!file) return;
        if (numberOfQuestions > MAX_NUMBER_QUESTIONS) {
            setError(`Max number of questions exceeded (${MAX_NUMBER_QUESTIONS})`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // OCR in frontend
            const extractedText = await runOCR(file);
            console.log('OCR Result:', extractedText);

            // Send text to Gemini backend route
            const res = await axios.post(`${baseURL}/gemini`, {
            text: extractedText,
            numberOfQuestions
            }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            setQaPairs(res.data.questionsAndAnswers || []);
        } catch (err) {
            setError('Failed to process image.');
            console.error(err);
        }

        setLoading(false);
    };

    return(
        
        <>
            <RequireAuth/>
            <div className='cover-img2text'>
                <h2>Upload an Image in order to extract questions from it</h2>
                <label className="inputFileWrapper">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                <h3>Select how many questions you want</h3>
                <input className = "inputNumber" type='number' min = "0" max = {MAX_NUMBER_QUESTIONS} value = {numberOfQuestions} onChange={handleNumberOfQuestions}/>
                <button className = "buttonGradient" onClick={handleUpload} disabled={loading || !file}>
                    {loading ? 'Processing...' : 'Upload and OCR'}
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {console.log(qaPairs)}
                {qaPairs.length > 0 && (
                    <div>
                    <h3>Generated Questions & Answers(Press Save to add to the set):</h3>
                    <ul>
                        {qaPairs.map((pair, index) => (
                        <li key={index}>
                            <strong>Q{index + 1}:</strong> {pair.question}<br /> 
                            <strong>A{index + 1}:</strong> {pair.answer}
                        </li>
                        ))}
                    </ul>
                    <button className = "buttonGradient" onClick={saveQuestionsToSet}>Save</button>
                    </div>
                )}
            </div>
        </>
    )

}
export default Img2Text;