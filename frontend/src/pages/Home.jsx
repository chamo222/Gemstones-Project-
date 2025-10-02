import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Process from '../components/Process'
import PopularFoods from '../components/PopularFoods'
import coverBanner1 from "../assets/cover-banner-1.jpg"
import coverBanner2 from "../assets/cover-banner-2.jpg"
import Footer from '../components/Footer'


const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Process />
      <PopularFoods />
      <div className='max-w-[1440px] mx-auto flex flex-col md:flex-row gap-7 py-12'>
        <div><img src={coverBanner1} alt="" className='md:rounded-e-2xl' /></div>
        <div><img src={coverBanner2} alt="" className='md:rounded-s-2xl' /></div>
      </div>
      <Footer />
    </>
  )
}

export default Home