import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config';

const Gift = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', coin: '', image: null });
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceForm, setPriceForm] = useState({ coinPrice: '', subscriptionPrice: '' });

    const fetchGift = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/gifts/all`);
            setData(res?.data?.data || []);
        } catch (error) {
            console.error('Error fetching gifts:', error);
        }
    };
    const fetchPrice = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/price/all`);
            if (res.data?.data) {
                setPriceForm({
                    coinPrice: res.data.data.coinPrice || '',
                    subscriptionPrice: res.data.data.subscriptionPrice || ''
                });
            }
        } catch (err) {
            console.error('Error fetching price:', err);
        }
    };

    useEffect(() => {
        fetchGift();
        fetchPrice();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.coin || !form.image) {
            toast.error('All fields are required');
            return;
        }
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('coin', form.coin);
        formData.append('image', form.image);
        try {
            await axios.post(`${config.baseUrl}/gifts/create`, formData);
            toast.success('Gift created successfully');
            setForm({ title: '', coin: '', image: null });
            setShowModal(false);
            fetchGift();
        } catch (err) {
            console.error('Error creating gift:', err);
            toast.error('Failed to create gift');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${config.baseUrl}/gifts/${id}`);
            toast.success('Gift deleted');
            fetchGift();
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete gift');
        }
    };


    const filteredData = data.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
    );

    const handlePriceSubmit = async (e) => {
        e.preventDefault();
        if (!priceForm.coinPrice || !priceForm.subscriptionPrice) {
            toast.error('All fields are required');
            return;
        }
        try {
            await axios.post(`${config.baseUrl}/price/create`, priceForm);
            toast.success('Pricing updated successfully');
            setShowPriceModal(false);
        } catch (err) {
            console.error('Error updating price:', err);
            toast.error('Failed to update pricing');
        }
    };


    return (
        <div className="">
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <div className='flex items-center gap-x-3 bg-[#FBFBFB] rounded-full p-2'>
                        <button className={`bg-white border py-1 px-6 rounded-full text-sm`}>Table</button>
                    </div>
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm" onClick={() => setShowModal(true)}>Add</button>
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm" onClick={() => setShowPriceModal(true)}>Update Pricing</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-start font-medium">Image</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Title</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Coin</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(gift => (
                            <tr key={gift._id}>
                                <td className="py-2 px-4 border-b">
                                    <img src={gift.image} alt="Gift" className="w-10 h-10 rounded-md" />
                                </td>
                                <td className="py-2 px-4 border-b">{gift.title}</td>
                                <td className="py-2 px-4 border-b">{gift.coin}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDelete(gift._id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Add Gift</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Coin</label>
                                <input type="number" value={form.coin} onChange={(e) => setForm({ ...form, coin: e.target.value })} className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="w-full" />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPriceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Update Pricing</h2>
                        <form onSubmit={handlePriceSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Coin Price</label>
                                <input
                                    type="number"
                                    value={priceForm.coinPrice}
                                    onChange={(e) => setPriceForm({ ...priceForm, coinPrice: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Subscription Price</label>
                                <input
                                    type="number"
                                    value={priceForm.subscriptionPrice}
                                    onChange={(e) => setPriceForm({ ...priceForm, subscriptionPrice: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowPriceModal(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Gift;
