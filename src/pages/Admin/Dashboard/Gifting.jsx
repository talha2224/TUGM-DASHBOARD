import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config';

const Gifting = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    const fetchGift = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/gift/all`);
            setData(res?.data?.data || []);
        } catch (error) {
            console.error('Error fetching gifts:', error);
            toast.error('Failed to fetch gift data');
        }
    };

    useEffect(() => {
        fetchGift();
    }, []);

    const filteredData = data.filter(g =>
        g.userId?.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center gap-x-3 bg-[#FBFBFB] rounded-full p-2">
                        <button className="bg-white border py-1 px-6 rounded-full text-sm">
                            Table
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left font-medium">Gift Name</th>
                            <th className="py-2 px-4 border-b text-left font-medium">Username</th>
                            <th className="py-2 px-4 border-b text-left font-medium">Email</th>
                            <th className="py-2 px-4 border-b text-left font-medium">Stream ID</th>
                            <th className="py-2 px-4 border-b text-left font-medium">Viewers Count</th>
                            <th className="py-2 px-4 border-b text-left font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((gift, index) => (
                            <tr key={gift._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{"N/A"}</td>
                                <td className="py-2 px-4">{gift.userId?.username}</td>
                                <td className="py-2 px-4">{gift.userId?.email}</td>
                                <td className="py-2 px-4">{gift.streamId}</td>
                                <td className="py-2 px-4">{gift.viewers?.length || 0}</td>
                                <td className="py-2 px-4">{new Date(gift.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-400">
                                    No gifts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Gifting;
