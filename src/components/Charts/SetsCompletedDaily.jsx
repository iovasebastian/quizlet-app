import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip
} from 'chart.js';
import axios from 'axios';
import { useEffect, useState } from 'react';


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function SetsCompletedDailyChart({visible}) {
  const [graphData, setGraphData] = useState([]);
  const token = localStorage.getItem("token");
  const baseURL = "https://server-three-taupe.vercel.app/api/items";
  //const baseURL = "http://localhost:3000/api/items";
  const noCompletions = localStorage.getItem("NoCompletions");

  const getDataDaily = async () =>{
    try{
      const response = await axios.get(`${baseURL}/getDailyData`,{
        headers: {Authorization : `Bearer ${token}`}
      });
      setGraphData(response?.data?.entryPerDay);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(()=>{
    getDataDaily();
    console.log('visible',visible);
  },[])

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sets',
      data: [graphData[0]||0, graphData[1]||0, graphData[2]||0, graphData[3]||0, graphData[4]||0, graphData[5]||0, graphData[6]||0],
      backgroundColor: '#6a0dad',
      borderRadius: 4,
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
    aspectRatio: 1,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 10 }
    }
  };

  return !visible
    ? <p className='numberStats'>No Completions yet!</p>
    : <Bar data={data} options={options} />;
}
