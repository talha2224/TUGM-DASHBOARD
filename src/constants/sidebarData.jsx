import { MdDashboard } from 'react-icons/md';
import { LuUser } from "react-icons/lu";
import { FaGift } from "react-icons/fa";
import { IoShirtSharp } from "react-icons/io5";
import { HiGiftTop } from "react-icons/hi2";



export const adminNav = [
    {
        id: 1,
        link: "home",
        name: "Home",
        icon: <MdDashboard className='text-[#FFCC00]' />
    },
    {
        id: 7,
        link: "user",
        name: "User Management",
        icon: <LuUser className="text-[#FF2D55]" />
    },
    {
        id: 8,
        link: "gifts",
        name: "Gifts Management",
        icon: <FaGift className="text-[#ff2d2d]" />
    },
    {
        id:10,
        link: "gifting",
        name: "Stream Gifts",
        icon: <HiGiftTop className="text-[#bc2dff]" />
    },
    {
        id: 9,
        link: "product",
        name: "Products Management",
        icon: <IoShirtSharp className="text-[#4465f5]" />
    },
    // {
    //     id: 4,
    //     link: "transaction",
    //     name: "Transaction",
    //     icon: <MdOutlineSyncAlt className="text-[#34C759]" />
    // }
]