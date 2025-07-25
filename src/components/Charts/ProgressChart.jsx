import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function ProgressChart({visible}) {

  //const baseURL = "http://localhost:3000/api/items";
  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  const [graphData, setGraphData] = useState([]);
  const token = localStorage.getItem("token");
  const noCompletions = localStorage.getItem("NoCompletions")

  const getData = async () =>{
    try{
      const response = await axios.get(`${baseURL}/getDataProgressChart`,{
        headers: {Authorization : `Bearer ${token}`}
      });
      setGraphData(response?.data?.weeks);
    }catch(error){
      console.error(error);
    }
  }
  useEffect(()=>{
    getData();
  },[])

  useEffect(()=>{
    console.log(graphData);
    console.log('week-3', graphData[getWeekNumber()-1])
  },[graphData])

  function getWeekNumber(date = new Date()) {
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = currentDate.getUTCDay() || 7;
    currentDate.setUTCDate(currentDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
    return weekNum;
  }
  const getMaximum = () =>{ 
    const values = Object.values(graphData);
    let max = 0;
    values.forEach(item => {
      if (item > max) max = item;
    });
    return max;
  }

  const data = {
    labels: [
      `Week ${getWeekNumber()-3}`,
      `Week ${getWeekNumber()-2}`,
      `Week ${getWeekNumber()-1}`,
      `Week ${getWeekNumber()}`
    ],
    datasets: [{
      label: 'Progress',
      data: [
        graphData[getWeekNumber()-3] || 0,
        graphData[getWeekNumber()-2] || 0,
        graphData[getWeekNumber()-1] || 0,
        graphData[getWeekNumber()] || 0
      ],
      backgroundColor: '#a100a1', 
      borderRadius: {
        topLeft: 4,
        topRight: 4,
        bottomLeft: 0,
        bottomRight: 0
      },
      borderSkipped: false
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    scales: {
      y: { beginAtZero: false, min: 0, max: Math.ceil(getMaximum()+0.2*getMaximum()) },
    },
    plugins: {
      legend: { display: false },
    }
  };

  return !visible
    ? <p className='numberStats'>No Completions yet!</p>
    : <Bar data={data} options={options} />;
}
