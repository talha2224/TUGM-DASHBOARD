import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';

const Products = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/product/all`);
            setData(res?.data?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        const loader = toast.loading("Deleting product...");
        try {
            await axios.delete(`${config.baseUrl}/product/del/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            toast.dismiss(loader);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredData = data.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md text-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-start font-medium">Image</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Title</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Description</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Price</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Stock</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Category</th>
                            <th className="py-2 px-4 border-b text-start font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(product => (
                            <tr key={product._id}>
                                <td className="py-2 px-4 border-b">
                                    {product.image ? (
                                        <img src={product.image} alt="Product" className="w-12 h-12 rounded-md object-cover" />
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">{product.title}</td>
                                <td className="py-2 px-4 border-b truncate max-w-xs">{product.description}</td>
                                <td className="py-2 px-4 border-b">${product.price}</td>
                                <td className="py-2 px-4 border-b">{product.stock}</td>
                                <td className="py-2 px-4 border-b">{product?.categoryId?.category || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-400">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
