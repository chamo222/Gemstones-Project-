import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuPizza } from "react-icons/lu";
import { MdOutlineShareLocation } from "react-icons/md";
import heroVideo from "../assets/heroVideo.mp4"; // Add your video file here

const Hero = () => {
  return (
    <section className='mx-auto max-w-[1440px]'>
      <div className='relative h-[811px] w-full overflow-hidden'>
        {/* Background video */}
        <video
          src={heroVideo}
          autoPlay
          muted
          playsInline
          className='absolute top-0 left-0 w-full h-full object-cover'
        />

        {/* Overlay for buttons */}
        

        {/* Optional: semi-transparent overlay for better contrast */}
        <div className='absolute top-0 left-0 w-full h-full bg-black/30'></div>
      </div>
    </section>
  );
};

export default Hero;