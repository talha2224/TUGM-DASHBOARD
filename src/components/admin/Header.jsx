import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { IoMdNotificationsOutline } from 'react-icons/io';

const Header = ({ location }) => {
    const { isNavOpen, toggleNav } = useSidebar();


    return (

        <div className='w-[100%] flex justify-between items-center p-5 px-3  bg-white'>

            <div className='flex items-center gap-x-4'>
                <GiHamburgerMenu className='lg:hidden block cursor-pointer' onClick={() => toggleNav(!isNavOpen)} />
                <h1 className='capitalize font-medium'>{location=="home"?"Dashboard":location}</h1>
            </div>

        </div>

    )
}

export default Header