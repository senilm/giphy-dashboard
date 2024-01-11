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
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Top 5 Search Terms",
    },
    datalabels: {
      display: true,
      color: "black",
      anchor: "center",
      align: "center",
      formatter: (value, context) =>
        context.dataset.customLabels[context.dataIndex] || "",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      // labels:customLabels
    },
    y: {
      stacked: true,
    },
  },
};

const SearchTerm = ({ startDate, endDate }) => {
  const [searchTermData, setSearchTermData] = useState([]);
  const [type, setType] = useState("daily");

  const onClickHandler = (newType) => {
    setType(newType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/searchTerm/${type}`,
          {
            method: "POST",
            body: JSON.stringify({ startDate, endDate }),
          }
        );
        const data = await response.json();
        console.log(data);
        setSearchTermData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [type, startDate, endDate]);

  let dateLabels;

  dateLabels = searchTermData.map((item) => item._id.$date);

  const labels = dateLabels.map((dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  });

  const colors = ["#5c3a4c", "#94475a", "#c95954", "#ef793d", "#ffa600"];

  searchTermData.forEach((item) => {
    item.searchTerms.sort((a, b) => b.count - a.count); 
  });

  const datasets = [];
  for (let i = 0; i < 5; i++) {
    datasets.push({
      label: `No. ${i + 1}`,
      data: searchTermData.map((item) => item.searchTerms[i]?.count || 0) || [],
      customLabels:
        searchTermData?.map(
          (item) => item.searchTerms[i]?.termdata?.keyword || 0
        ) || [],
      backgroundColor: colors[i],
    });
  }

  // console.log(searchTermData[0]?.searchTerms[0].termdata.keyword);
  // console.log(searchTermData[2]?.searchTerms[0].termdata.keyword);

  const data = {
    labels,
    datasets: datasets,
  };

  return (
    <div className="flex">
      <div className="border-2 border-white shadow-lg mb-3 rounded-[20px] py-4 px-6">
        <div className="flex justify-end mt-1">
          <Button
            label={"Daily"}
            onClickHandler={() => onClickHandler("daily")}
          />
          <Button
            label={"Weekly"}
            onClickHandler={() => onClickHandler("weekly")}
          />
          <Button
            label={"Monthly"}
            onClickHandler={() => onClickHandler("monthly")}
          />
        </div>
        <Bar options={options} data={data} width={500} height={400} />
      </div>
    </div>
  );
};

export default SearchTerm;
