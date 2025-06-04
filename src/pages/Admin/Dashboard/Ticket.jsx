import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config';

const Ticket = () => {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', status: 'Normal' });

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/ticket/all`);
            setTickets(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            toast.error('Title and description are required');
            return;
        }
        try {
            await axios.post(`${config.baseUrl}/ticket/create`, form);
            toast.success('Ticket created successfully');
            setForm({ title: '', description: '', status: 'Normal' });
            setShowModal(false);
            fetchTickets();
        } catch (err) {
            console.error('Error creating ticket:', err);
            toast.error('Failed to create ticket');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${config.baseUrl}/ticket/del/${id}`);
            toast.success('Ticket deleted');
            fetchTickets();
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete ticket');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${config.baseUrl}/ticket/update/status/${id}`, { status });
            toast.success('Status updated');
            fetchTickets();
        } catch (err) {
            console.error('Status update error:', err);
            toast.error('Failed to update status');
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm" onClick={() => setShowModal(true)}>Add</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-start font-medium">Title</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Description</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Status</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td className="py-2 px-4 border-b">{ticket.title}</td>
                                <td className="py-2 px-4 border-b">{ticket.description}</td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="Urgent">Urgent</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDelete(ticket._id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md">Delete</button>
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
                        <h2 className="text-lg font-semibold mb-4">Add Ticket</h2>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-md px-3 py-2">
                                    <option value="Urgent">Urgent</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ticket;
