import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CorrectWrongChart({visible}) {
  const [questionsCorrectPercentage, setQuestionsCorrectPercentage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const token = localStorage.getItem("token");
  const noCompletions = localStorage.getItem("NoCompletions");
  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  //const baseURL = "http://localhost:3000/api/items";

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

  useEffect(()=>{
    getPercentOfCorrectQuestions();
  },[]);


  useEffect(()=>{
    console.log('total', totalQuestions, 'questionsCorrectPercentage', questionsCorrectPercentage)
  },[totalQuestions, questionsCorrectPercentage]);

  const data = {
    labels: ['Unknown', 'Known'],
    datasets: [{
      data: [100-questionsCorrectPercentage, questionsCorrectPercentage],
      backgroundColor: ['#d6336c', '#6a0dad'],
      borderWidth: 0,
    }]
  };

  const options = {
    responsive: true,
    cutout: '70%',
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#333',
          boxWidth: 12,
        }
      }
    }
  };

  return !visible
    ? <p className='numberStats'>No Completions yet!</p>
    : <Doughnut data={data} options={options} />;
}
