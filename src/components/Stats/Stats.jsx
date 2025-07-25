import './stats.css';
import CorrectWrongChart from '../Charts/CorrectWrongChart';
import ProgressChart from '../Charts/ProgressChart';
import SetsCompletedDailyChart from '../Charts/SetsCompletedDaily';
import { useEffect, useState } from 'react';
import axios from 'axios';
import KnownQuestionsProgression from '../Charts/KnownQuestionsProgression';

const Stats = () => {
    const [totalSets, setTotalSets] = useState(0);
    const [questionsCorrectPercentage, setQuestionsCorrectPercentage] = useState(0);
    const [completion, setCompletion] = useState(true);
    const token = localStorage.getItem("token");
    const baseURL = "https://server-three-taupe.vercel.app/api/items";
    //const baseURL = "http://localhost:3000/api/items";

    useEffect(()=>{
        getTotalSets();
        getPercentOfCorrectQuestions();
    },[]);

    const getTotalSets = async () =>{
        try{
            const response = await axios.get(`${baseURL}/getTotalSets`,
            {
                headers: {Authorization : `Bearer ${token}`}
            });
            setTotalSets(response.data.setNumber);
        }catch(error){
            console.error(error);
        }
    };
    const getPercentOfCorrectQuestions = async () =>{
        try{
            const response = await axios.get(`${baseURL}/getCorrectQuestionsPercentage`,{
                headers: {Authorization : `Bearer ${token}`}  
            });
            setQuestionsCorrectPercentage(response.data.percentageOfCorrect);
        }catch(error){
            console.error(error);
        }
    }
    const noCompletions = () =>{
        return "No completions yet!";
    }
    const completions = () =>{
        return questionsCorrectPercentage + " %";
    }

    return(
        <>
            <div className='center'>
                <div className='glassStats'>
                    <h1>My performance</h1>
                    <div className='gridStats'>
                        <div className='gridChild totalSets'>
                            <h3>Total sets</h3>
                            <p className='numberStats'>{totalSets}</p>
                        </div>
                        <div className='gridChild accuracy'>
                            <h3>Correct questions answered</h3>
                            <p className='numberStats'>{isNaN(questionsCorrectPercentage)? noCompletions() : completions()}</p>
                        </div>
                        <div className='gridChild progress'>
                            <h3>Sets accessed per week</h3>
                            <div className='chart'>
                                <ProgressChart visible = {!isNaN(questionsCorrectPercentage)}/>
                            </div>
                        </div>
                        <div className='gridChild correctVWrong'>
                            <h3>Pie chart of correct questions</h3>
                            <div className='chart'>
                                <CorrectWrongChart visible = {!isNaN(questionsCorrectPercentage)}/>
                            </div>
                        </div>
                        <div className='gridChild setsCompleted'>
                            <h3>Total sets completed daily</h3>
                            <div className='chart'>
                                <SetsCompletedDailyChart visible = {!isNaN(questionsCorrectPercentage)}/>
                            </div>
                        </div>
                        <div className='gridChild timeSpent'>
                            <h3>Percentage of correct questions daily</h3>
                            <div className='chart'>
                                <KnownQuestionsProgression visible = {!isNaN(questionsCorrectPercentage)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Stats;