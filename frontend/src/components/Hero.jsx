import React from 'react'
import { NavLink } from 'react-router-dom'
import { LuPizza } from "react-icons/lu"
import { MdOutlineShareLocation } from "react-icons/md"
import client1 from "../assets/client1.jpg"
import client2 from "../assets/client2.jpg"
import client3 from "../assets/client3.jpg"


const Hero = () => {
  return (
    <section className='mx-auto max-w-[1440px] '>
      <div className='relative bg-hero bg-cover bg-center bg-no-repeat h-[811px] w-full'>
        <div className='max-padd-container relative top-36 sm:top-72 text-black'>
          <h1 className='h1 max-w-[44rem] capitalize'>Locally produced delivered direct <span className='text-[#4169E1]'>to your door</span></h1>
          <p className='text-black regular-16 mt-6 max-w-[33rem]'>Welcome to our food haven, where taste meets quality! Savor dishes crafted with passion, fresh ingredients, and unmatched care. From quick bites to hearty meals, we bring flavors that delight. Let us turn your hunger into happiness, one bite at a time!</p>
          <div className='flexStart !items-center gap-x-4 my-10'>
            <div className='flex relative'>
              {/* client images */}
              <img src={client1} alt="" className='h-[46px] shadow-sm rounded-full' />
              <img src={client2} alt="" className='h-[46px] shadow-sm rounded-full absolute left-8' />
              <img src={client3} alt="" className='h-[46px] shadow-sm rounded-full absolute left-16' />
            </div>
            <div className='bold-16 sm:bold-24 ml-14 relative top-1 text-[#4169E1]'>176k <span className='regular-16 sm:regular-20 text-[#4169E1]'>Excellent Reviews</span></div>
          </div>
          <div className='max-xs:flex-col flex gap-2'>
            <NavLink to={'menu'} className={'btn-white flexCenter gap-x-2'}> <LuPizza className='text-xl'/>Shop now</NavLink>
            <NavLink to={'/orders'} className={'btn-white flexCenter gap-x-2'}> <MdOutlineShareLocation className='text-xl'/>Track Order</NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero