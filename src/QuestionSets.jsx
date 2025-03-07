import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./questionset.css";
import { useState, useEffect } from 'react';
import plusSvg from "./plus-svgrepo-com.svg";
const baseURL = "https://server-three-taupe.vercel.app/api/items";
//const baseURL = "http://localhost:3000/api/items";
const QuestionSets = () => {
    const navigate = useNavigate();
    const [dataStored, setDataStored] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [username, setUsername] = useState("");
    const [event, setEvent] = useState(false);
    const [deletePending, setDeletePending] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteTitle, setDeleteTitle] = useState('');
    const getExistingData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                return;
            }
            const response = await axios.get(`${baseURL}?username=${user.username}`);
            setUsername(user.username);
            return response.data;
            
        }
        catch (error) {
            console.error(error);
        }
    };
    const handleRetrieveAll = async () => {
        try {
            const existingData = await getExistingData();
            setDataStored(existingData);
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const navigateSet = async (data, index) => {
        const someState = {data};
        const indexJSON = JSON.stringify(index);
        localStorage.setItem('indexSet', indexJSON);
        sessionStorage.setItem('myState', JSON.stringify(someState));
        navigate('/main');
    };
    useEffect(() => {
        handleRetrieveAll();
    }, []);
    useEffect(() => {
        handleRetrieveAll();
    }, [event]);

    const addNewSet = async (username, title) => {
        try {
            await axios.post(`${baseURL}/question-set`, {username, title});
            setEvent((prevState) => !prevState);
            setNewTitle("");
            console.log(dataStored);
          } catch (error) {
            console.error('Error saving data:', error);
          }
    }
    const deleteSet = async (username, _id, event) =>{
        event.stopPropagation();
        try {
            await axios.post(`${baseURL}/deleteQuestionSet`, {username, _id});
            setEvent((prevState) => !prevState);
          } catch (error) {
            console.error('Error deleting data:', error);
          }
    }

    const elements = dataStored.map((data, index) =>
        <div key={index} className='divSet' onClick={() => navigateSet(data, index)}>
            <h2>{data.title}</h2>
            {/*<button className = "butonSet" onClick = {(e) => deleteSet(username, data._id, e)}>Delete</button>*/}
            <button className = "butonSet" onClick={(e) => {
                e.stopPropagation(); // Prevents click from propagating to div
                setDeletePending(true);
                setDeleteId(data._id);
                setDeleteTitle(data.title);
            }}>Delete</button>
            {deletePending&&<div className='pendingDeleteDiv'>
                <h1>Are you sure you want to delete the question set "{deleteTitle}"?</h1>
                <button className = "butonSet" onClick={(e) => {e.stopPropagation(); setDeletePending(false);}}>Cancel</button>
                <button className = "butonSet" onClick={(e) => {e.stopPropagation(); deleteSet(username, deleteId, e); setDeletePending(false)}}>Delete</button>
            </div>}
        </div>
        
    )
    return (
        <div className='backgroundSets'>
            {elements}
            <div className='divSetAdd'>
                <h2>Choose a title: </h2>
                <input className = "inputSet" type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <button className = "butonSet" onClick={() => addNewSet(username, newTitle)}>Add set</button>
            </div>
        </div>

    )
}
export default QuestionSets;