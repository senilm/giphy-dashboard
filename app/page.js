'use client'
import Image from 'next/image'
import Logins from '@/components/Logins'
import Favorite from '@/components/Favorite'
import SearchTerm from '@/components/SearchTerm'
import getStartEndDate from '@/utils/getStartEndDate'
import { useState } from 'react'

export default function Home() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  return (
   <div className='flex border-white shadow-md p-3 rounded-[2rem] bg-white border-2'>
    <div className=' flex-col gap-4 px-10'>
      <div className=' gap-4 flex mb-2'>
      Filter date:
        <input type='date' placeholder='start' className=' border-b' value={startDate} onChange={(e)=>setStartDate(e.target.value)}></input>
        <span>To </span>
        <input type='date' value={endDate} placeholder='end' className='border-b' onChange={(e)=>setEndDate(e.target.value)}></input>
      </div>
      <div className=' flex justify-center  mt-5'>
    <SearchTerm {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/>
    </div>
    </div>
    

    <div className='w-full flex-col  gap-3justify-between  mt-3'>
    <Favorite {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/> 
    <Logins {...(startDate !== '' && endDate !== '' ? { startDate, endDate } : {})}/>
    </div>
    
   </div>
  )
}
