import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.svg"


const Header = () => {
    return (
        <header className='max-padd-container flexCenter py-4 bg-white'>
            {/* logo */}
            <Link to={'/'} className='bold-24 flex items-baseline'>
                <img src={logo} alt="" height={30} width={30} className='hidden sm:flex' />
                <span className='text-black pl-2'>B Sirisena Holdings Pvt Ltd</span>
            </Link>
        </header>
    )
}

export default Header