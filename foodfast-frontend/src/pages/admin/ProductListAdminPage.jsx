import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ProductListAdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useContext(AuthContext);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // 1. Khai báo URL từ biến môi trường (nếu chưa có)
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            // 2. Gọi API sử dụng biến đó
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                // PHẦN QUAN TRỌNG NHẤT: Tạo config với token của admin
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // Gửi config đi kèm với request xóa
                await axios.delete(`http://localhost:3000/api/products/${id}`, config);

                fetchProducts(); // Tải lại danh sách sản phẩm để cập nhật UI
            } catch (error) {
                alert('Xóa sản phẩm thất bại. Bạn có quyền admin không?');
                console.error(error.response?.data?.message || error.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
                <Link to="/admin/product/create">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        + Tạo Sản phẩm Mới
                    </button>
                </Link>
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        {/* ... thead ... */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">ID SẢN PHẨM</th>
                                <th scope="col" className="px-6 py-3">TÊN</th>
                                <th scope="col" className="px-6 py-3">GIÁ</th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Hành động</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hidden md:table-cell">
                                        {product._id}
                                    </td>
                                    <td className="px-6 py-4">{product.name}</td>
                                    <td className="px-6 py-4">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="px-6 py-4 text-right flex gap-4 justify-end">
                                        <Link to={`/admin/product/${product._id}/edit`} className="font-medium text-blue-600 hover:underline">Sửa</Link>
                                        <button onClick={() => deleteHandler(product._id)} className="font-medium text-red-600 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductListAdminPage;