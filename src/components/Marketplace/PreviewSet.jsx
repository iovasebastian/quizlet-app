import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

const PreviewSet = ({onClose, setId}) =>{
    const [previewQA, setPreviewQA] = useState([]);
    const token = localStorage.getItem("token");
    const baseURL = process.env.REACT_APP_BASE_URL
    
    const fetchQuestions = async (setId) =>{
        try{
            const response = await axios.get(`${baseURL}/getPublicSetPreview`, {
                params: { setId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreviewQA(response.data.questions);
        }catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchQuestions(setId);
        console.log('seeeet',setId)
    },[])

    return(  
        <div className="overlay">
            <div className="uploadMenu">
                <div onClick = {onClose} className='closeButton'><IoIosClose /></div>
                <h1 className="titleUploadMenu">Preview the question Set</h1>
                <div className="previewSetSpace">
                    {previewQA.map((question, index)=>(
                        <div className = "questionLinePreview" key = {question.id}>
                            <p>{index + 1}.</p>
                            <p>Q: {question.questionText}</p>
                            <p>A: {question.answerText}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
        
    )
}
export default PreviewSet;