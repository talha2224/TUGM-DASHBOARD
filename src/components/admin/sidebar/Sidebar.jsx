import React, { useEffect, useRef, useState } from 'react';
import { adminNav } from '../../../constants/sidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';
import { useSidebar } from '../../../context/SidebarContext';
import { RxCross2 } from 'react-icons/rx';
import Logo from '../../../assets/logo.png'

const Sidebar = () => {

  const location = useLocation().pathname.split("/")[3];
  const [showLogout, setshowLogout] = useState(false)
  const { isNavOpen, toggleNav } = useSidebar();
  const sidebarRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleNav();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleNav]);



  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`lg:block hidden w-[15rem] h-[100vh] bg-[#000] relative border-r border-r-[#D8D8D880]`}>

        <div className="flex gap-x-2 p-5 justify-center items-center">
          <span className="text-xl text-white -ml-5">TUGM</span>
        </div>


        <div className='mt-8'>
          {adminNav?.map((i) => (
            <Link to={`/admin/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#282727]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer`}>
              <div>{i.icon}</div>
              <p className={`text-sm ${location == i.link ? "text-[#fff]" : "text-[#8F8F8F]"}`}>{i.name}</p>
            </Link>
          ))}
        </div>

        <div onClick={() => nav("/")} className='absolute bottom-5 w-[80%] flex items-center gap-x-3 cursor-pointer mx-5 '>
          <IoLogOut className='text-[#FF3B30] cursor-pointer text-xl' />
          <p className='text-[#C9C9C9]'>Log out</p>
        </div>

      </div>

      {/* Mobile Sidebar */}
      {
        isNavOpen && (
          <div className={`lg:hidden block w-[14rem] z-50 h-[100vh] bg-[#0F0F0F] fixed top-0 left-0 transition-all duration-300 ease-in-out ${isNavOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`} ref={sidebarRef}>

            <div className="flex gap-x-2 p-5 justify-center items-center">

              <span className="text-xl text-white -ml-5">TUGM</span>
            </div>


            <div className='mt-8'>
              {adminNav?.map((i) => (
                <Link to={`/admin/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#282727]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer`}>
                  <div>{i.icon}</div>
                  <p className={`text-sm ${location == i.link ? "text-[#fff]" : "text-[#8F8F8F]"}`}>{i.name}</p>
                </Link>
              ))}
            </div>

            <div onClick={() => nav("/")} className='absolute bottom-5 w-[80%] flex items-center gap-x-3 cursor-pointer mx-5 '>
              <IoLogOut className='text-[#FF3B30] cursor-pointer text-xl' />
              <p className='text-[#C9C9C9]'>Log out</p>
            </div>

          </div>
        )}
    </>
  );
};

export default Sidebar;
