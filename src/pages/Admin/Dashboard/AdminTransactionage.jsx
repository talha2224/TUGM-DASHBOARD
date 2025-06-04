import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';

const AdminTransactionage = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/transaction/history/all`);
            const transactions = totalUser?.data?.data;
            setData(transactions);
            setFilteredData(transactions); // Initialize filtered data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Handle search
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = data.filter(i =>
            i?._id?.toLowerCase().includes(lowercasedQuery) ||
            i?.userId?.username?.toLowerCase().includes(lowercasedQuery) ||
            i?.userId?.email?.toLowerCase().includes(lowercasedQuery) ||
            i?.amount==searchQuery
        );
        setFilteredData(filtered);
    }, [searchQuery, data]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input
                        type="text"
                        placeholder="Search by username, email or ID..."
                        className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
                </div>
            </div>

            <div className="overflow-x-auto mt-10">
                <table className="min-w-full bg-white border rounded-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Id</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Image</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">User Name</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Email</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Amount</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Date</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Payment Method</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((i) => (
                            <tr key={i._id}>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?._id}</td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">
                                    {i?.userId?.profile ? (
                                        <img src={i?.userId?.profile} alt="Profile" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.userId?.username}</td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.userId?.email}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#007AFF]">{`$ ${i?.amount}`}</td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{new Date(i.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">Stripe</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTransactionage;
