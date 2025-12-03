import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const OrderListAdminPage = () => {
    const [orders, setOrders] = useState([]);
    const [branches, setBranches] = useState([]);
<<<<<<< HEAD
    const [selectedBranch, setSelectedBranch] = useState('');
=======
    const [selectedBranch, setSelectedBranch] = useState(''); // Branch đang được xem
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userInfo } = useContext(AuthContext);
<<<<<<< HEAD
    const isSuperAdmin = !userInfo?.branchId;

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const SOCKET_URL = import.meta.env.VITE_ORDER_SOCKET_URL || 'http://localhost:3003';
    const DELIVERY_SERVICE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:3005';

    // 1. Tải danh sách chi nhánh
    useEffect(() => {
        const fetchBranches = async () => {
            if (!isSuperAdmin) {
                setSelectedBranch(userInfo.branchId);
                return;
            }
            try {
                const { data } = await axios.get(`${API_URL}/api/branches`);
                setBranches(data);
=======

    // Kiểm tra quyền: Nếu không có branchId -> Super Admin
    const isSuperAdmin = !userInfo?.branchId;

    // Cấu hình URL
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const SOCKET_URL = import.meta.env.VITE_ORDER_SOCKET_URL || 'http://localhost:3003';

    // 1. Tải danh sách chi nhánh (Chỉ cho Super Admin)
    useEffect(() => {
        const fetchBranches = async () => {
            if (!isSuperAdmin) {
                // Nếu là Manager, set cứng branchId của họ
                setSelectedBranch(userInfo.branchId);
                return;
            }

            try {
                const { data } = await axios.get(`${API_URL}/api/branches`);
                setBranches(data);
                // Mặc định chọn chi nhánh đầu tiên
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                if (data.length > 0) setSelectedBranch(data[0]._id);
            } catch (err) {
                console.error("Lỗi tải danh sách chi nhánh:", err);
            }
        };
<<<<<<< HEAD
        if (userInfo) fetchBranches();
    }, [userInfo, isSuperAdmin, API_URL]);

    // 2. Fetch Orders & Setup Socket
    useEffect(() => {
        if (!selectedBranch || !userInfo) return;

=======

        if (userInfo) fetchBranches();
    }, [userInfo, isSuperAdmin, API_URL]);

    // 2. Fetch Orders & Setup Socket (Chạy lại khi selectedBranch thay đổi)
    useEffect(() => {
        if (!selectedBranch || !userInfo) return;

        // A. Hàm fetch dữ liệu đơn hàng
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
<<<<<<< HEAD
=======
                // Gọi API có lọc theo branchId
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                const { data } = await axios.get(
                    `${API_URL}/api/orders/all?branchId=${selectedBranch}`,
                    config
                );
                setOrders(data);
                setError('');
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

<<<<<<< HEAD
=======
        // B. Kết nối WebSocket
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log(`🟢 Socket connected. Joining room: ${selectedBranch}`);
<<<<<<< HEAD
            socket.emit('join_branch', selectedBranch);
        });

        socket.on('new_order', (newOrder) => {
            console.log('🔔 Có đơn hàng mới:', newOrder._id);
            setOrders((prev) => [newOrder, ...prev]);
        });

=======
            // Quan trọng: Join vào room của chi nhánh này để nghe tin
            socket.emit('join_branch', selectedBranch);
        });

        // Lắng nghe đơn mới
        socket.on('new_order', (newOrder) => {
            console.log('🔔 Có đơn hàng mới:', newOrder._id);
            // Thêm đơn mới vào đầu danh sách (cần reload hoặc merge thủ công)
            // Để đơn giản và đảm bảo dữ liệu (như tên user) đầy đủ, ta gọi lại fetchOrders
            fetchOrders();
            // Hoặc nếu muốn nhanh: setOrders((prev) => [newOrder, ...prev]); (nhưng newOrder chưa populate tên user)

            // Phát tiếng chuông (Optional)
            // const audio = new Audio('/notification.mp3'); audio.play();
        });

        // Lắng nghe cập nhật trạng thái (ví dụ: Bếp làm xong, Shipper nhận)
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        socket.on('order_update', (updatedOrder) => {
            setOrders((prev) =>
                prev.map(order => order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order)
            );
        });

<<<<<<< HEAD
=======
        // Cleanup
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        return () => {
            socket.disconnect();
        };

    }, [selectedBranch, userInfo, API_URL, SOCKET_URL]);

<<<<<<< HEAD
    // --- 3. HÀM XỬ LÝ CHUYỂN ĐỔI TRẠNG THÁI ---
    const updateStatusHandler = async (orderId, nextStatus) => {
        let confirmMsg = "Bạn chắc chắn muốn cập nhật trạng thái?";

        if (nextStatus === 'PREPARING') confirmMsg = "Xác nhận đơn và bắt đầu nấu?";
        if (nextStatus === 'READY_TO_SHIP') confirmMsg = "Món đã xong. Đóng gói chờ giao?";
        if (nextStatus === 'CANCELLED') confirmMsg = "⚠️ CẢNH BÁO: Bạn chắc chắn muốn HỦY đơn hàng này? Hành động này không thể hoàn tác.";

        if (!window.confirm(confirmMsg)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.put(
                `${API_URL}/api/orders/${orderId}/status`,
                { status: nextStatus },
                config
            );
        } catch (err) {
            alert('Lỗi cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
        }
    };

    // --- 4. HÀM GỌI DRONE ---
    const callDroneDelivery = async (orderId) => {
        if (!window.confirm("Gọi Drone giao hàng ngay?")) return;

        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'PROCESSING_REQUEST' } : o));

        try {
            const { data } = await axios.post(`${DELIVERY_SERVICE_URL}/start-delivery`, {
                orderId: orderId,
                branchId: selectedBranch
            });
            alert(`📡 ${data.message}. Drone ${data.drone.name} đang bay!`);

            setOrders(prev => prev.map(o =>
                o._id === orderId ? { ...o, status: 'SHIPPING', droneId: data.drone.name } : o
            ));

        } catch (err) {
            alert("❌ Không thể gọi Drone: " + (err.response?.data?.message || "Lỗi server/Hết Drone"));
            setOrders(prev => prev.map(o => o._id === orderId && o.status === 'PROCESSING_REQUEST' ? { ...o, status: 'READY_TO_SHIP' } : o));
        }
    };

=======
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    Quản lý Đơn Hàng
                    {!isSuperAdmin && <span className="text-indigo-600 ml-2 text-xl">(Chi nhánh)</span>}
                </h1>

<<<<<<< HEAD
=======
                {/* Dropdown chọn chi nhánh (Chỉ hiện cho Super Admin) */}
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                {isSuperAdmin ? (
                    <div className="flex items-center bg-white p-2 rounded shadow border">
                        <span className="mr-2 font-semibold text-gray-600">Chi nhánh:</span>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="border-none outline-none bg-transparent font-medium text-indigo-600 cursor-pointer"
                        >
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
<<<<<<< HEAD
=======
                    // Hiển thị cho Branch Manager
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm">
                        🔒 Đang quản lý chi nhánh của bạn
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Mã Đơn</th>
                                <th className="px-6 py-3">Thời Gian</th>
<<<<<<< HEAD
                                <th className="px-6 py-3">Tổng Tiền</th>
                                <th className="px-6 py-3">Thanh Toán</th>
                                <th className="px-6 py-3">Trạng Thái</th>
                                <th className="px-6 py-3">Mã Drone  </th>
=======
                                <th className="px-6 py-3">Khách Hàng</th>
                                <th className="px-6 py-3">Tổng Tiền</th>
                                <th className="px-6 py-3">Thanh Toán</th>
                                <th className="px-6 py-3">Trạng Thái</th>
                                <th className="px-6 py-3">Drone</th>
                                <th className="px-6 py-3">Thao Tác</th>
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
<<<<<<< HEAD
                                    <td className="px-6 py-3 font-mono text-gray-900">
                                        #{order._id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-3 font-bold text-gray-900">
                                        {order.totalPrice.toLocaleString('vi-VN')} ₫
                                    </td>

                                    {/* --- CỘT THANH TOÁN (ĐÃ SỬA) --- */}
                                    <td className="px-6 py-3">
                                        {order.isPaid ? (
                                            // Đã thanh toán (Online)
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                Đã TT
                                            </span>
                                        ) : order.paymentMethod === 'COD' ? (
                                            // Chưa thanh toán nhưng là COD
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-xs font-bold">
                                                💵 COD
                                            </span>
                                        ) : (
                                            // Online nhưng chưa trả
=======
                                    <td className="px-6 py-4 font-mono text-gray-900">
                                        #{order._id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {/* SỬA LẠI: userId.name thay vì user.name */}
                                        {order.userId?.name || 'Khách vãng lai'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {order.totalPrice.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                Đã TT
                                            </span>
                                        ) : (
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                Chưa TT
                                            </span>
                                        )}
                                    </td>
<<<<<<< HEAD
                                    {/* ------------------------------- */}

                                    <td className="px-6 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold block w-fit
                                            ${(order.status === 'DELIVERED' || order.status === 'Delivered') ? 'bg-green-100 text-green-800' :
                                                (order.status === 'SHIPPING' || order.status === 'Shipped') ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                                                    order.status === 'READY_TO_SHIP' ? 'bg-orange-100 text-orange-800' :
                                                        (order.status === 'PREPARING' || order.status === 'Processing') ? 'bg-blue-100 text-blue-800' :
                                                            (order.status === 'CANCELLED' || order.status === 'Cancelled') ? 'bg-red-100 text-red-800' :
                                                                order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.status === 'PROCESSING_REQUEST' ? 'bg-gray-300 text-gray-700 animate-pulse' :
                                                                        'bg-gray-100 text-gray-800'}`}>

                                            {order.status === 'PAID_WAITING_PROCESS' ? 'Chờ Xác Nhận' :
                                                order.status === 'PENDING_PAYMENT' ? 'Chờ TT' :
                                                    (order.status === 'PREPARING' || order.status === 'Processing') ? 'Đang Nấu' :
                                                        order.status === 'READY_TO_SHIP' ? 'Chờ Drone' :
                                                            (order.status === 'SHIPPING' || order.status === 'Shipped') ? 'Đang Bay' :
                                                                (order.status === 'DELIVERED' || order.status === 'Delivered') ? 'Hoàn Tất' :
                                                                    (order.status === 'CANCELLED' || order.status === 'Cancelled') ? 'Đã Hủy' :
                                                                        order.status === 'PROCESSING_REQUEST' ? 'Đang Gọi...' :
                                                                            order.status}
=======

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status || 'Pending'}
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 font-mono text-blue-600 text-xs">
<<<<<<< HEAD
                                        {order.droneId ? (
                                            <span className="flex items-center gap-1 font-bold">
                                                🚁 {order.droneId}
                                            </span>
                                        ) : '-'}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center gap-2">

                                            {/* 1. Nút Xác nhận / Nấu */}
                                            {(order.status === 'PAID_WAITING_PROCESS' || (order.status === 'Pending' && order.paymentMethod === 'COD')) && (
                                                <button
                                                    onClick={() => updateStatusHandler(order._id, 'PREPARING')}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs font-bold shadow flex items-center transition-transform hover:scale-105"
                                                    title="Xác nhận đơn và chuyển xuống bếp"
                                                >
                                                    🔥 Xác nhận
                                                </button>
                                            )}

                                            {/* 2. Nút Đóng gói */}
                                            {(order.status === 'PREPARING' || order.status === 'Processing') && (
                                                <button
                                                    onClick={() => updateStatusHandler(order._id, 'READY_TO_SHIP')}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-xs font-bold shadow flex items-center transition-transform hover:scale-105 animate-pulse"
                                                    title="Bếp đã nấu xong, chuyển sang đóng gói"
                                                >
                                                    🎁 Đóng gói
                                                </button>
                                            )}

                                            {/* 3. Nút Gọi Drone */}
                                            {order.status === 'READY_TO_SHIP' && (
                                                <button
                                                    onClick={() => callDroneDelivery(order._id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-bold shadow flex items-center transition-transform hover:scale-105"
                                                    title="Gọi Drone đến lấy hàng đi giao"
                                                >
                                                    🚀 Gọi Drone
                                                </button>
                                            )}

                                            {/* 4. Nút Xem chi tiết */}
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
                                                title="Xem chi tiết"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </Link>

                                            {/* 5. Nút Hủy Đơn */}
                                            {['PENDING_PAYMENT', 'PAID_WAITING_PROCESS', 'Pending', 'PREPARING', 'Processing', 'READY_TO_SHIP'].includes(order.status) && (
                                                <button
                                                    onClick={() => updateStatusHandler(order._id, 'CANCELLED')}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Hủy đơn hàng"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}

                                        </div>
=======
                                        {order.droneId || '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                        >
                                            Chi tiết
                                        </Link>
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-500 italic">
                                        Chưa có đơn hàng nào tại chi nhánh này.
                                    </td>
                                </tr>
                            )}
<<<<<<< HEAD
=======
=======
// Corrected import path with .jsx extension
import { AuthContext } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const OrderListAdminPage = () => {
    // State variables
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Get user info (including token) from context
    const { userInfo } = useContext(AuthContext);

    // Fetch orders when component mounts or userInfo changes
    useEffect(() => {
        const fetchAllOrders = async () => {
            // Check for user info and token
            if (!userInfo || !userInfo.token) {
                setError('Vui lòng đăng nhập với quyền admin.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true); // Start loading
                // Configure request headers with Authorization token
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                // Fetch all orders from the backend via API Gateway
                const { data } = await axios.get('http://localhost:3000/api/orders/all', config);
                setOrders(data); // Store fetched orders
                setError(''); // Clear any previous errors
            } catch (err) {
                // Handle fetch errors (like 401 Unauthorized or 403 Forbidden)
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Bạn không có quyền truy cập trang này.');
                } else {
                    setError('Không thể tải danh sách đơn hàng.');
                }
                console.error("Fetch all orders error:", err.response?.data?.message || err.message);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };
        fetchAllOrders();
    }, [userInfo]); // Re-run effect if userInfo changes

    // Display loading state
    if (loading) {
        return <p className="text-center mt-8">Đang tải danh sách đơn hàng...</p>;
    }

    // Display error state
    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    // Render the order list table
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Quản lý Đơn Hàng</h1>

            {orders.length === 0 ? (
                // Display message if no orders exist
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">Không có đơn hàng nào để hiển thị.</p>
                    {/* Link back to homepage could be added here */}
                </div>
            ) : (
                // Display the table if orders exist
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        {/* Table Header */}
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID ĐƠN HÀNG</th>
                                <th scope="col" className="px-6 py-3">NGƯỜI DÙNG (ID)</th>
                                <th scope="col" className="px-6 py-3">NGÀY ĐẶT</th>
                                <th scope="col" className="px-6 py-3">TỔNG TIỀN</th>
                                <th scope="col" className="px-6 py-3">THANH TOÁN</th>
                                <th scope="col" className="px-6 py-3">TRẠNG THÁI GIAO</th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Hành động</span>
                                </th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                                    {/* Order ID */}
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order._id}</td>
                                    {/* User ID (can be enhanced later to show name/email) */}
                                    <td className="px-6 py-4">{order.userId}</td>
                                    {/* Order Date */}
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    {/* Total Price */}
                                    <td className="px-6 py-4">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    {/* Payment Status */}
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-semibold">Rồi</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Chưa</span>
                                        )}
                                    </td>
                                    {/* Delivery Status */}
                                    <td className="px-6 py-4">{order.status}</td>
                                    {/* Action Button (View Details) */}
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/order/${order._id}`} className="font-medium text-indigo-600 hover:underline">
                                            Xem Chi tiết
                                        </Link>
                                        {/* Placeholder for future "Mark Delivered" button */}
                                        {/* {!order.isDelivered && ( <button>Mark Delivered</button> )} */}
                                    </td>
                                </tr>
                            ))}
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListAdminPage;