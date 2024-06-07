"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Button from "./Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Favorites chart",
    },
  },
};

const Favorite = ({startDate,endDate}) => {
  const [favoriteData, setFavoriteData] = useState([]);
  const [type, setType] = useState("daily");

  const onClickHandler = (searchType) => {
    setType(searchType)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite/${type}`,{
            method:'POST',
            body:JSON.stringify({startDate,endDate})
          }
        );
        const data = await response.json();
        setFavoriteData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [type,startDate,endDate]);

  const dateLabels = favoriteData.map((item) => item.date.$date);
  const labels = dateLabels.map((dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "No. of favorites",
        data: favoriteData.map((item) => item.count),
        backgroundColor: "#ffa600",
      },
    ],
  };

  return (
    <div className="flex">
      <div className="border-1 shadow-md mb-3 rounded-[20px]  px-6">
      <div className="flex justify-end mt-1">
        <Button label={'Daily'} onClickHandler={()=>onClickHandler('daily')}/>
        <Button label={'Weekly'} onClickHandler={()=>onClickHandler('weekly')}/>
        <Button label={'Monthly'} onClickHandler={()=>onClickHandler('monthly')}/>
      </div>
        <Bar options={options} data={data} width={1120} height={400}/>
      </div>
      
    </div>
  );
};

export default Favorite;
