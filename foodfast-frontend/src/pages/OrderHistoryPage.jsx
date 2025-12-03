import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Make sure Link is imported

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo || !userInfo.token) {
                setError('Bạn cần đăng nhập để xem lịch sử.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/myorders/${userInfo._id}`, config);                setOrders(data);
            } catch (err) {
                setError('Không thể tải lịch sử đơn hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo]);

    if (loading) return <p className="text-center mt-8">Đang tải lịch sử đơn hàng...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>
            {orders.length === 0 ? (
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">
                        Bắt đầu mua sắm
                    </Link>
                </div>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID ĐƠN HÀNG</th>
                                <th scope="col" className="px-6 py-3">NGÀY ĐẶT</th>
                                <th scope="col" className="px-6 py-3">TỔNG TIỀN</th>
                                <th scope="col" className="px-6 py-3">TRẠNG THÁI</th>
                                <th scope="col" className="px-6 py-3">ĐÃ THANH TOÁN</th>
                                {/* Add new header for details */}
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Chi tiết</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {order._id}
                                    </th>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="px-6 py-4">{order.status}</td>
                                    <td className="px-6 py-4">{order.isPaid ? 'Rồi' : 'Chưa'}</td>
                                    {/* Add new cell with Link */}
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                        >
                                            Chi tiết
                                        </Link>
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

export default OrderHistoryPage;