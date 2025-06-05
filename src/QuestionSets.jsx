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
    const userId = JSON.parse(localStorage.getItem('userId'));
    const getExistingData = async () => {
        try {
            if (!userId) {
                return;
            }
            const response = await axios.get(`${baseURL}?userId=${userId}`);
            //setUsername(user.username);
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
            console.log("existing data", existingData);
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    };

    const navigateSet = async (data, index) => {
        localStorage.setItem('questionSetId', Number(data.questionSetId))
        navigate('/main',{
            state : {questionSetTitle: data.title}
        });
    };
    useEffect(() => {
        handleRetrieveAll();
    }, []);
    useEffect(() => {
        handleRetrieveAll();
    }, [event]);

    const addNewSet = async (userId, title) => {
        try {
            await axios.post(`${baseURL}/question-set`, {userId, title});
            setEvent((prevState) => !prevState);
            setNewTitle("");
            console.log(dataStored);
          } catch (error) {
            console.error('Error saving data:', error);
          }
    }
    const deleteSet = async (questionSetId, event) =>{
        event.stopPropagation();
        try {
            await axios.post(`${baseURL}/deleteQuestionSet`, {questionSetId});
            setEvent((prevState) => !prevState);
          } catch (error) {
            console.error('Error deleting data:', error);
          }
    }

    const elements = dataStored?.map((data, index) =>
        <div key={index} className='divSet' onClick={() => navigateSet(data, index)}>
          <h2>{data.title}</h2>
          <button
            className="butonSet"
            onClick={(e) => {
              e.stopPropagation();
              setDeletePending(true);
              setDeleteId(data.questionSetId);
              setDeleteTitle(data.title);
            }}
          >
            Delete
          </button>
        </div>
      );
    return (
        <div className='backgroundSets'>
            {elements}
            {deletePending && (
            <>
                <div className="deleteOverlay" onClick={() => setDeletePending(false)} />
                <div className="pendingDeleteDiv">
                <h1>Are you sure you want to delete the question set "{deleteTitle}"?</h1>
                <button className="butonSet" onClick={() => setDeletePending(false)}>Cancel</button>
                <button className="butonSet" onClick={(e) => {
                    e.stopPropagation();
                    deleteSet(deleteId, e);
                    setDeletePending(false);
                }}>Delete</button>
                </div>
            </>
            )}
            <div className='divSetAdd'>
                <h2>Choose a title: </h2>
                <input className = "inputSet" placeholder = "Title..." type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <button className = "butonSet" onClick={() => addNewSet(userId, newTitle)}>Add set</button>
            </div>
        </div>

    )
}
export default QuestionSets;