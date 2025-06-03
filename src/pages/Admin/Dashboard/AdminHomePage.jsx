import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { FaUsers, FaUserSlash } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa6';
import { GrTransaction } from 'react-icons/gr';
import { FaDeleteLeft } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Map from '../../../assets/dashboard/worldmap.svg'
import { BsSoundwave } from 'react-icons/bs';

const AdminHomePage = () => {

    const [data, setData] = useState({ totalUser: [], totalTransaction: [], declineTransactions: [], unverifiedAccount: [], });
    const [transactionData, setTransactionData] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [lastMonthEarnings, setLastMonthEarnings] = useState(0);
    const [countryData, setCountryData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/account/all`);
            const totalTransaction = await axios.get(`${config.baseUrl}/transfer/all`);
            const declineTransactions = totalTransaction?.data?.data?.filter((i) => i.decline);
            const unverifiedAccount = totalUser?.data?.data?.filter((i) => !i?.accountVerified);
            setData({
                totalTransaction: totalTransaction?.data?.data,
                totalUser: totalUser?.data?.data,
                declineTransactions,
                unverifiedAccount,
            });
            processTransactionData(totalTransaction?.data?.data);
            processCountryData(totalTransaction?.data?.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processTransactionData = (transactions) => {
        if (!transactions) return;

        const monthlyTransactions = {};
        let currentMonthEarnings = 0;
        let prevMonthEarnings = 0;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            const year = transactionDate.getFullYear();
            const month = transactionDate.getMonth();

            if (year === currentYear) {
                if (month === currentMonth) {
                    currentMonthEarnings += transaction.amount;
                } else if (month === currentMonth - 1) {
                    prevMonthEarnings += transaction.amount;
                }

                const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(transactionDate);
                if (!monthlyTransactions[monthName]) {
                    monthlyTransactions[monthName] = {
                        month: monthName,
                        amount: 0,
                    };
                }
                monthlyTransactions[monthName].amount += transaction.amount;
            }
        });

        setTotalEarnings(currentMonthEarnings);
        setLastMonthEarnings(prevMonthEarnings);
        setTransactionData(Object.values(monthlyTransactions));
    };

    const processCountryData = (transactions) => {
        if (!transactions) return;

        const countryCounts = {};
        transactions.forEach((transaction) => {
            const country = transaction.reciverCountry;
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        const countryArray = Object.entries(countryCounts).map(([country, count]) => ({
            country,
            count,
        }));

        countryArray.sort((a, b) => b.count - a.count); // Sort by count in descending order
        setCountryData(countryArray);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div>

            <div className="flex justify-between items-center gap-x-4 overflow-x-auto">

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#34C759] flex items-center gap-x-4 text-white px-5">
                    <FaUsers className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Total User</p>
                        <p className="text-white text-2xl font-medium">{data?.totalUser?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#FFCC00] flex items-center gap-x-4 text-white px-5">
                    <GrTransaction className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Total Transacations</p>
                        <p className="text-white text-2xl font-medium">{data?.totalTransaction?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#FF3B30] flex items-center gap-x-4 text-white px-5">
                    <FaDeleteLeft className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Decline Transacations</p>
                        <p className="text-white text-2xl font-medium">{data?.declineTransactions?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#5856D6] flex items-center gap-x-4 text-white px-5">
                    <FaUserSlash className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Unverified Account</p>
                        <p className="text-white text-2xl font-medium">{data?.unverifiedAccount?.length}</p>
                    </div>
                </div>

            </div>

            <div className="w-[25rem] h-[10rem] p-4 bg-[#30b0c7] mt-7 rounded-xl text-white">

                <p className="mb-2">Total Earnings</p>
                <p className="text-[1.6rem] font-medium">${totalEarnings}</p>

                <p className="mt-5 text-[#34ff67]">{lastMonthEarnings !== 0 ? `+${(((totalEarnings - lastMonthEarnings) / lastMonthEarnings) * 100).toFixed(2)}%` : '+0.00%'}<span className="text-white"> than last month</span></p>

            </div>

            <div className="bg-white w-[100%] p-5 rounded-xl mt-10 shadow-md">
                <h1 className="text-xl font-medium">Transaction Trends</h1>
                <ResponsiveContainer width="100%" height={300} className="mt-10 -ml-5">
                    <BarChart data={transactionData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#126E5F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className='mt-10 flex justify-center items-center p-5 rounded-md'>
                <img src={Map} alt="" />
            </div>

            <div className='mt-10 flex items-start justify-between flex-wrap'>

                <div className='sm:min-w-[21rem] sm:max-w-[21rem] w-[100%] bg-white rounded-md shadow-md p-5 mt-4'>
                    <h1 className='text-lg font-medium'>Top Country</h1>

                    <div className='flex justify-between items-center mt-2 text-sm text-[#616161]'>
                        <p>Country</p>
                        <p>Users</p>
                    </div>
                    {countryData.map((item, index) => (
                        <div key={index} className='flex justify-between items-center mt-2'>
                            <p>{item.country}</p>
                            <p>{item.count}</p>
                        </div>
                    ))}
                </div>


                <div className='sm:min-w-[21rem] sm:max-w-[21rem] w-[100%] bg-white rounded-md shadow-md p-5 mt-4 flex gap-x-4 items-center'>
                    <BsSoundwave className='text-[2.5rem] text-[#5CCFFE]' />
                    <div>
                        <p className='text-sm'>User Activity</p>
                        <p className='text-2xl font-medium'>{data?.totalUser?.length - data?.unverifiedAccount?.length}</p>
                    </div>
                </div>


                <div className='sm:min-w-[21rem] sm:max-w-[21rem] w-[100%] bg-white rounded-md shadow-md p-5 mt-4 flex gap-x-4 items-center'>
                    <FaChartLine className='text-[2rem] text-[#1BD8BA]' />
                    <div>
                        <p className='text-sm'>User Activity</p>
                        <p className='text-2xl font-medium'>{data?.totalUser?.length}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminHomePage;