"use client";
import Image from "next/image";
import Logins from "@/components/Logins";
import Favorite from "@/components/Favorite";
import SearchTerm from "@/components/SearchTerm";
import getStartEndDate from "@/utils/getStartEndDate";
import { useState } from "react";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState(1);

  const handleData = (num) => {
    setSelected(num);
    setStartDate("");
    setEndDate("")
  };
  return (
    <div className=" border-white shadow-md p-3 rounded-[2rem] bg-white border-2">
      <div className=" gap-4 px-10">
        <div className="flex justify-center">
          {" "}
          <div className="grid  grid-cols-3  border px-3 py-1 bg-slate-100 rounded-xl">
            <button
              className={` py-2 rounded-xl px-4   ${
                selected == 1 ? `bg-white` : ``
              }`}
              onClick={() => handleData(1)}
            >
              Search Terms
            </button>
            <button
              className={` py-2 px-4 rounded-xl  ${
                selected == 2 ? `bg-white` : ``
              }`}
              onClick={() => handleData(2)}
            >
              Favorites
            </button>
            <button
              className={` py-2 px-4 rounded-xl  ${
                selected == 3 ? `bg-white` : ``
              }`}
              onClick={() => handleData(3)}
            >
              Active users
            </button>
          </div>
        </div>
        <div className=" gap-4 flex mt-2">
          Filter date:
          <input
            type="date"
            placeholder="start"
            className=" border-b"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
          <span>To </span>
          <input
            type="date"
            value={endDate}
            placeholder="end"
            className="border-b"
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
        </div>
      </div>

      <div className="w-full  mt-3">
        {selected == 1 && 
        <SearchTerm {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/>
        }
        {selected == 2 && 
        <Favorite {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/> 
        }
        {selected == 3 && 
        <Logins {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/>
        }
      </div>
    </div>
  );
}
