import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg'
const Navbar = () => {

    return (
        <nav className="">
            <div className="px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">


                    <div className="flex-shrink-0 flex items-center gap-x-2">
                        <img src={Logo} alt="" className='h-10'/>
                        <span className="text-xl">NGOC ANH</span>
                    </div>

                    <div className="block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <Link to="/login" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                            <Link to="/register"><button className="bg-[#9FE7F5] px-4 py-2 rounded-md text-sm font-medium ml-4">Signup</button></Link>
                        </div>
                    </div>

                </div>
            </div>

        </nav>
    );
}

export default Navbar;