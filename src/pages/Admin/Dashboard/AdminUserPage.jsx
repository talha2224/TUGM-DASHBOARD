import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';

const AdminUserPage = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [notificationText, setNotificationText] = useState('');
    const [badgeImage, setBadgeImage] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/account/all`);
            setData(res?.data?.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleBlockUnblock = async (userId, block) => {
        const loader = toast.loading("Processing request...");
        try {
            await axios.put(`${config.baseUrl}/account/block/${userId}`);
            toast.success(`User ${block ? 'blocked' : 'unblocked'}`);
            fetchUsers();
        } catch {
            toast.error("Failed to update block status");
        } finally {
            toast.dismiss(loader);
        }
    };

    const handleToggleSellerMode = async (userId, currentStatus) => {
        const loader = toast.loading("Updating seller mode...");
        try {
            await axios.put(`${config.baseUrl}/account/switch/profile/${userId}`, {
                sellerMode: !currentStatus
            });
            toast.success("Seller mode updated");
            fetchUsers();
        } catch {
            toast.error("Failed to update seller mode");
        } finally {
            toast.dismiss(loader);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredData = data.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignBadge = async () => {
        const loader = toast.loading("Assigning badge...");
        try {
            const formData = new FormData();
            formData.append('image', badgeImage);
            await axios.put(`${config.baseUrl}/account/assign/badge/${selectedUserId}`, formData);
            toast.success("Badge assigned successfully");
            fetchUsers()
            setShowModal(false);
            setBadgeImage(null);
        } catch {
            toast.error("Failed to assign badge");
        } finally {
            toast.dismiss(loader);
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <div className='flex items-center gap-x-3 bg-[#FBFBFB] rounded-full p-2'>
                        <button className="bg-white border py-1 px-6 rounded-full text-sm">Table</button>
                    </div>
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Profile</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Badge</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Username</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Email</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Role</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Subscribed</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Blocked</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Seller Mode</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Coins</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Followers</th>
                            <th className="py-2 px-4 border-b text-sm text-start font-medium text-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(user => (
                            <tr key={user._id}>
                                <td className="py-2 px-4 border-b">
                                    {user.profile ? (
                                        <img src={user.profile} alt="Profile" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {user.badge ? (
                                        <img src={user.badge} alt="Profile" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{user.username}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                                <td className="py-2 px-4 border-b">{user.isSubscribed ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 text-xs rounded-md ${user.isBlocked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">{user.sellerMode ? 'Enabled' : 'Disabled'}</td>
                                <td className="py-2 px-4 border-b">{user.coins}</td>
                                <td className="py-2 px-4 border-b">{user.followers}</td>
                                <td className="py-2 mt-3 px-4 border-b space-x-2 flex flex-nowrap">
                                    <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md text-nowrap mt-1" onClick={() => handleBlockUnblock(user._id, !user.isBlocked)}>{user.isBlocked ? 'Unblock' : 'Block'}</button>
                                    <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md text-nowrap mt-1" onClick={() => handleToggleSellerMode(user._id, user.sellerMode)}>Toggle Seller</button>
                                    <button onClick={() => {setSelectedUserId(user._id);setModalType('notification');setShowModal(true);}} className="bg-[#F2F2F2] text-nowrap rounded-md px-3 py-1 text-xs">Send Notification</button>
                                    <button onClick={() => {setSelectedUserId(user._id);setModalType('badge');setShowModal(true);}} className="bg-[#F2F2F2] text-nowrap rounded-md px-3 py-1 text-xs">Assign Badge</button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center py-4 text-gray-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        {modalType === 'notification' ? (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
                                <textarea
                                    rows="4"
                                    className="w-full border rounded-md p-2 mb-4"
                                    placeholder="Enter notification message..."
                                    value={notificationText}
                                    onChange={(e) => setNotificationText(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-200 rounded-md text-sm"
                                    >Cancel</button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const loader = toast.loading("Sending...");
                                                await axios.post(`${config.baseUrl}/notification/invite`, {
                                                    userId: selectedUserId,
                                                    description: notificationText,
                                                });
                                                toast.success("Notification sent");
                                                setShowModal(false);
                                                setNotificationText('');
                                                toast.dismiss(loader);
                                            } catch (err) {
                                                toast.error("Failed to send notification");
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                                    >Send</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Assign Badge</h2>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setBadgeImage(e.target.files[0])}
                                    className="mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-200 rounded-md text-sm"
                                    >Cancel</button>
                                    <button
                                        onClick={handleAssignBadge}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                                    >Assign</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserPage;