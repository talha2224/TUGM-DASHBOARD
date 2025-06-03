import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminTransactionage = () => {

    const [data, setData] = useState([]);
    const [taxModel, setTaxModel] = useState(false);
    const [taxData, settaxData] = useState(null);
    const [value, setvalue] = useState(0)

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/transfer/all`);
            const tax = await axios.get(`${config.baseUrl}/tax/single`);
            setData(totalUser?.data?.data);
            settaxData(tax?.data?.data)
            setvalue(tax?.data?.data?.value)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const approvedRequest = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/transfer/approved/${id}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Payment Approved")
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }
    const declineRequest = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/transfer/decline/${id}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Payment Decline")
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }

    const updateTax = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/tax/update/${taxData?._id}`,{value});
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Tax Updated")
                setTaxModel(false)
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    console.log(taxData, 'taxData')

    return (
        <div>


            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setTaxModel(!taxModel)} className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Tax</button>
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
                </div>
            </div>


            <div className="overflow-x-auto mt-10">
                <table className="min-w-full bg-white border rounded-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Id</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Date</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">User Name</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Amount</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Payment Method</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Delivery Method</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Reciver Delivery Details</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Reciver City</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Reciver Country</th>

                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Status</th>
                            <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((i) => (
                            <tr key={i._id}>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?._id}</td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{new Date(i.createdAt).toLocaleDateString()}</td>
                                <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.userId?.firstName} {i?.userId?.lastName}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#007AFF]">{`$ ${i?.amount}`}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.paymentMethod}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.deliveryMode}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.reciverAccountNumber}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.reciverCity}</td>
                                <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.reciverCountry}</td>


                                <td className="py-2 px-4 border-b">
                                    <span className={`px-2 py-1 rounded-md text-xs text-nowrap ${i.decline ? 'bg-red-200 text-red-700' : 'bg-[#DCEDFF] text-[#007AFF]'}`}>{(i.decline && !i?.approved) ? 'Decline' : i?.approved ? "Approved" : 'Pending'}</span>
                                </td>
                                <td className="py-2 px-4 border-b flex gap-x-3">

                                    {
                                        (!i?.decline && !i?.approved) ?
                                            <div className='flex gap-x-3'>
                                                {!i?.decline && <span onClick={() => declineRequest(i?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-red-200 text-red-700`}>Decline Request</span>}
                                                {!i.approved && <span onClick={() => approvedRequest(i?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Approved Request</span>}
                                            </div>

                                            :
                                            <span className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs ${i.decline ? 'bg-red-200 text-red-700' : 'bg-[#DCEDFF] text-[#007AFF]'}`}>{i.decline ? "Request Already Decline" : "Request Already Approved"}</span>

                                    }

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {taxModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 w-[20rem] rounded-lg relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={()=>setTaxModel(!taxModel)} >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold mb-4 text-center">Update Tax</h2>
                        <input defaultValue={value} placeholder='Tax In Percentage' className="rounded-md px-5 w-[100%] py-2 text-sm border outline-none"  onChange={(e)=>setvalue(e?.target?.value)} type="number" name="" id="" />
                        <button onClick={updateTax} className="bg-[#F2F2F2] rounded-md px-5 w-[100%] py-2 text-sm mt-2">Save</button>
                    </div>
                </div>
            )}





        </div>
    );
};

export default AdminTransactionage;