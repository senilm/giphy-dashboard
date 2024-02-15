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
      text: "Active users chart",
    },
  },
};

const Logins = ({ startDate, endDate }) => {
  const [loginData, setLoginData] = useState([]);
  const [type, setType] = useState("daily");

  const handleButtonClick = (newType) => {
    setType(newType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/logins/${type}`,
          {
            method: "POST",
            body: JSON.stringify({ startDate, endDate }),
          }
        );
        const data = await response.json();
        setLoginData(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [type, startDate, endDate]);

  const dateLabels = loginData?.map((item) => item.date.$date);
  const labels = dateLabels?.map((dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  });

  const data = {
    labels,
    datasets: [
      {
        label: "No. of active users",
        data: loginData.map((item) => item.distinctUsersCount),
        backgroundColor: "#c0a0b1",
      },
    ],
  };
  return (
    <div className="flex">
      <div className="border-2 border-white shadow-lg rounded-[20px] mt-[2.1rem] px-6">
        <div className="flex justify-end mt-1">
        <Button
          label={"Daily"}
          onClickHandler={() => handleButtonClick("daily")}
        />
        <Button
          label="Weekly"
          onClickHandler={() => handleButtonClick("weekly")}
        />
        <Button
          label="Monthly"
          onClickHandler={() => handleButtonClick("monthly")}
        />
      </div>
        <Bar options={options} data={data} width={450} height={200} />
      </div>
      
    </div>
  );
};

export default Logins;
