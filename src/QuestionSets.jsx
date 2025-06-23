import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./questionset.css";
import { useState, useEffect } from 'react';
import RequireAuth from './RequireAuth';
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
    const [editTitleToggle, setEditTitleToggle] = useState(false);
    const [editTitleId, setEditTitleId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const token = localStorage.getItem("token");


    useEffect(()=>{
        console.log(editTitle);
    },[editTitle])

    const getExistingData = async () => {
        try {
            const response = await axios.get(`${baseURL}`,{
                headers: {Authorization: `Bearer ${token}`}
            });
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

    const startEdit = (e, title, questionSetId) =>{
        e.stopPropagation();
        setEditTitleToggle(true);
        setEditTitle(title);
        setEditTitleId(questionSetId);
    }

    const saveEditTitle = async (e, questionSetId) =>{
        e.stopPropagation();
        setEditTitleToggle(false);
        console.log(questionSetId);
        try{
            const response = await axios.post(`http://localhost:3000/api/items/editTitle`, {
                questionSetId: questionSetId,
                title: editTitle
            },{
                headers: {Authorization : `Bearer ${token}`}
            })
            console.log('edit title response', response);
        }catch(e){
            console.log(e);
        } 
        setDataStored(prev =>
            prev.map(item =>
              item.questionSetId === questionSetId ? { ...item, title: editTitle } : item
            )
        );
       
    }

    const handleEditTitleChange = (e) =>{
        setEditTitle(e.target.value);
    }

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

    const addNewSet = async (title) => {
        try {
            await axios.post(`${baseURL}/question-set`,
                { title },
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
            await axios.post(`${baseURL}/deleteQuestionSet`, 
                {questionSetId},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent((prevState) => !prevState);
          } catch (error) {
            console.error('Error deleting data:', error);
          }
    }

    const elements = dataStored?.map((data, index) =>
        <div key={index} className='divSet' onClick={() => navigateSet(data, index)}>
          {editTitleToggle && editTitleId === data.questionSetId ? <input className = "inputSet edit" onClick = {(e) => e.stopPropagation()} value={editTitle} onChange={handleEditTitleChange}/> : <h2>{data.title}</h2>}
          {editTitleToggle && editTitleId === data.questionSetId?
          <button
            className="butonSet"
            onClick={(e) => saveEditTitle(e, data.questionSetId)}
          >
            Done
          </button>:
          <button
            className="butonSet"
            onClick={(e) => startEdit(e, data.title, data.questionSetId)}
            >
            Edit title
          </button>}
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
        <>
        <RequireAuth />
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
                <button className = "butonSet" onClick={() => addNewSet(newTitle)}>Add set</button>
            </div>
        </div>
        </>
    )
}
export default QuestionSets;