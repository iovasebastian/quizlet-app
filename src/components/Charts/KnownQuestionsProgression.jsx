import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function KnownQuestionsProgression({visible}) {
  const [graphData, setGraphData] = useState([]);
  const token = localStorage.getItem("token");
  const noCompletions = localStorage.getItem("NoCompletions");
  const baseURL = process.env.REACT_APP_BASE_URL

  function getWeekNumber(date = new Date()) {
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = currentDate.getUTCDay() || 7;
    currentDate.setUTCDate(currentDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(((currentDate - yearStart) / 86400000 + 1) / 7);
    return weekNum;
  }

  const getData = async () =>{
    try{
      const response = await axios.get(`${baseURL}/getWeeklyPercentage`,{
        headers: {Authorization : `Bearer ${token}`}
      });
      setGraphData(response?.data?.percentageByWeek);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    getData();
  },[]);
  useEffect(()=>{
    console.log(graphData)
  },[graphData]);

  const data = {
    labels: [
      `Week ${getWeekNumber()-3}`,
      `Week ${getWeekNumber()-2}`,
      `Week ${getWeekNumber()-1}`,
      `Week ${getWeekNumber()}`
    ],
    datasets: [{
      label: 'Known Percentage',
      data: [graphData[0]?.percentage || 0, graphData[1]?.percentage || 0, graphData[2]?.percentage || 0, graphData[3]?.percentage] || 0,
      backgroundColor: '#6a0dad',
      borderRadius: 6,
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
    y: {
      beginAtZero: true,
      suggestedMin: 0,
      suggestedMax: 100, // 💡 helps prevent top clipping
      grid: {
        color: '#ddd'
      },
      ticks: {
        padding: 8,       // adds space between axis and label
        color: '#333'
      }
    },
    x: {
      grid: {
        color: '#f0f0f0'
      },
      ticks: {
        color: '#333'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

  return !visible
      ? <p className='numberStats'>No Completions yet!</p>
      : <Line data={data} options={options} />;
}
