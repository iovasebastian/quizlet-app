import axios from "axios";
import { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import Popup from "./Popup";

const UploadMenu = ({onClose, idOfQuestionSets}) =>{
    const [itemId, setItemId] = useState();
    const [menuPage, setMenuPage] = useState(1);
    const [price, setPrice] = useState(1);
    const [difficulty, setDifficulty] = useState("");
    const [subject, setSubject] = useState("");
    const [userQuestionSets, setUserQuestionSets] = useState([]);
    const [errorValue, setErrorValue] = useState("");
    const [stripeId, setStripeId] = useState("");
    const [stripeError, setStripeError] = useState(false);
    const token = localStorage.getItem("token");

    const baseURL = process.env.REACT_APP_BASE_URL

    const handleNextPageUpload = () =>{
        setMenuPage(prev => prev + 1)
    }
    const handlePrevPageUpload = () =>{
        setMenuPage(prev => prev - 1)
    }

    const fetchUserStripeId = async () =>{
        try{
            const response = await axios.get(`${baseURL}/getStripeId`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            setStripeId(response.data[0].stripeId)
        }catch(error){
            console.error(error);
        }

    }

    useEffect(()=>{
        fetchUserSets();
        fetchUserStripeId();
        console.log('inside', idOfQuestionSets)
    },[]);


    useEffect(()=>{
        console.log(stripeId)
    },[stripeId])

    const fetchUserSets = async () =>{
        try{
            const response = await axios.get(`${baseURL}`, {
                headers: {Authorization : `Bearer ${token}`}
            });
            setUserQuestionSets(response.data);
        }catch(error){
            console.error(error);
        }
    }

    const selectLine = (questionSetId) =>{
        setItemId(questionSetId);  
    }

    const handleUpload = async () =>{
        if(!subject){
            setErrorValue("Subject is empty");
            return;
        }
        if(!difficulty){
            setErrorValue("Difficulty is empty");
            return;
        }
        if (price !=0 && !stripeId){
            setStripeError(true);
            return;
        }
        try{
            const publicSetId = await axios.post(`${baseURL}/uploadPublicSet`,{
                price: price,
                subject: subject,
                difficulty: difficulty,
                questionSetId : itemId,
                ownerStripeId: stripeId
            },{
                headers: {Authorization : `Bearer ${token}`}
            })
            onClose();
            window.location.reload();
        }catch(error){
            console.error(error);
        }
    }

    return(
        <div className='overlay'>
            <div className='uploadMenu'>
                <div onClick = {onClose} className='closeButton'><IoIosClose /></div>
                <h1 className='titleUploadMenu'>My sets</h1>
                <div className='setSelectionZone'>
                    {menuPage === 1? userQuestionSets
                    .filter((items)=>(
                        !idOfQuestionSets.includes(items.questionSetId)
                    ))
                    .map((items) =>(
                        <div onClick = {() => selectLine(items.questionSetId)} className={items.questionSetId === itemId? 'userQuestionSetLine selected' : 'userQuestionSetLine'}>
                            <div className={items.questionSetId === itemId? 'radio-entity selected' : 'radio-entity'}></div>
                            <p>{items.title}</p>
                        </div>
                    )):
                        <div className='spacePage2'>
                            <div>
                                <label>Price (euro) *Set price to 0 for a free set* (ONLY FREE SETS FOR NOW)</label>
                                <input value = {price} onChange = {(e) => {if(e.target.value<0)e.target.value = 0; if(e.target.value > 100)e.target.value = 100;setPrice(e.target.value)}} className = 'inputUpload' type = "number" min = "1" max = "100"/>
                            </div>
                            <div>
                                <label>Difficulty</label>
                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className = 'inputUpload'>
                                    <option value="">Select level</option>
                                    <option value = "Beginner">Beginner</option>
                                    <option value = "Intermediate">Intermediate</option>
                                    <option value = "Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label>Subject</label>
                                <select value = {subject} onChange = {(e) => setSubject(e.target.value)} className = 'inputUpload'>
                                    <option value = "">Select subject</option>
                                    <option value = "Computer Science">Computer Science</option>
                                    <option value = "Mathematics">Mathematics</option>
                                    <option value = "Other">Other</option>
                                </select>
                            </div> 
                            {errorValue && <p className="error">{errorValue}</p>}
                        </div>
                }
                </div>
                {menuPage === 1 
                ?<div className="buttonDivUploadPage1"><button buttonDivUpload onClick={handleNextPageUpload} className = 'buttonRemove'>Next</button></div>
                :<div className="buttonDivUpload">
                    <button onClick={handlePrevPageUpload} className = 'buttonRemove'>Back</button>
                    <button onClick={handleUpload} className = 'buttonRemove'>Upload</button>
                </div>
                }
            </div>
            <Popup show={stripeError} onClose={() => setStripeError(false)} />
        </div>
    )
}
export default UploadMenu;

