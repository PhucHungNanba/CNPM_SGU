import React, { useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { io } from 'socket.io-client';
=======
<<<<<<< HEAD
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
=======
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

const OrderPage = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
<<<<<<< HEAD
=======
<<<<<<< HEAD
    const { userInfo } = useContext(AuthContext);

    const [order, setOrder] = useState(null);
    const [branchInfo, setBranchInfo] = useState(null); // State lưu thông tin chi nhánh
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchOrder = async () => {
            if (!userInfo) return;
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                // 1. Lấy đơn hàng
                const { data: orderData } = await axios.get(`${API_URL}/api/orders/${orderId}`, config);
                setOrder(orderData);

                // 2. Lấy thông tin chi nhánh (nếu có branchId)
                if (orderData.branchId) {
                    try {
                        const { data: branchData } = await axios.get(`${API_URL}/api/branches/${orderData.branchId}`);
                        setBranchInfo(branchData);
                    } catch (err) {
                        console.error("Không lấy được thông tin chi nhánh");
                    }
                }
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
=======
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false); // State for payment button
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    const { userInfo } = useContext(AuthContext);

    const [order, setOrder] = useState(null);
    const [branchInfo, setBranchInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // --- BIẾN KIỂM TRA QUYỀN ADMIN (Dùng chung cho toàn bộ trang) ---
    const isAdmin = userInfo?.isAdmin;

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const SOCKET_URL = import.meta.env.VITE_ORDER_SOCKET_URL || 'http://localhost:3003';

    // 1. Fetch Dữ liệu (Đơn hàng & Chi nhánh)
    useEffect(() => {
        const fetchOrder = async () => {
<<<<<<< HEAD
            if (!userInfo) return;
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const { data: orderData } = await axios.get(`${API_URL}/api/orders/${orderId}`, config);
                setOrder(orderData);

                if (orderData.branchId) {
                    try {
                        const { data: branchData } = await axios.get(`${API_URL}/api/branches/${orderData.branchId}`);
                        setBranchInfo(branchData);
                    } catch (err) { console.error(err); }
                }
=======
            if (!userInfo || !userInfo.token) {
                setError('Bạn cần đăng nhập để xem đơn hàng.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://localhost:3000/api/orders/${orderId}`, config);
                setOrder(data);
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Không thể tải thông tin đơn hàng.');
                console.error("Fetch order error:", err);
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
<<<<<<< HEAD
    }, [orderId, userInfo, API_URL]);

    // 2. Socket.IO Real-time
    useEffect(() => {
        if (!orderId) return;

        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            socket.emit('join_order', orderId);
        });

        socket.on('status_update', (data) => {
            console.log("Status update:", data);
            setOrder((prev) => ({ ...prev, ...data }));
        });

        socket.on('order_update', (updatedOrder) => {
            console.log("Order update:", updatedOrder);
            setOrder(updatedOrder);
        });

        return () => {
            socket.disconnect();
        };
    }, [orderId, SOCKET_URL]);

    // --- HELPER: NỘI DUNG HIỂN THỊ THEO TRẠNG THÁI ---
    const renderStatusMessage = () => {
        if (!order) return {};
        switch (order.status) {
            case 'PENDING_PAYMENT':
                return { text: 'Vui lòng thanh toán để nhà hàng lên đơn!', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '💳' };
            case 'PAID_WAITING_PROCESS':
            case 'Pending':
                return { text: 'Đã thanh toán! Đang chờ nhà hàng xác nhận...', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '⏳' };
            case 'PREPARING':
            case 'Processing':
                return { text: 'Nhà hàng đang nấu món ngon, vui lòng đợi xíu nhé...', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '👨‍🍳' };
            case 'READY_TO_SHIP':
                return { text: 'Đã đóng gói xong! Đang chờ Drone đến lấy...', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '📦' };
            case 'SHIPPING':
            case 'Shipped':
                return { text: 'Drone đang bay giao tới bạn!', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '🚁' };
            case 'DELIVERED':
            case 'Delivered':
                return { text: 'Đơn hàng đã hoàn tất. Chúc ngon miệng!', color: 'bg-green-100 text-green-800 border-green-200', icon: '😋' };
            case 'CANCELLED':
            case 'Cancelled':
                return { text: 'Đơn hàng đã bị hủy.', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' };
            default:
                return { text: 'Trạng thái đơn hàng: ' + order.status, color: 'bg-gray-100 border-gray-200', icon: 'ℹ️' };
        }
    };

    // 3. Xử lý Thanh toán
    const onlinePaymentHandler = async () => {
        if (!window.confirm('Thanh toán Online ngay?')) return;
        setPaymentProcessing(true);
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/pay`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert('Thanh toán thành công!');
        } catch (error) {
            alert('Thanh toán thất bại.');
=======
<<<<<<< HEAD
    }, [orderId, userInfo, API_URL]);

    // --- XỬ LÝ THANH TOÁN ---
    const onlinePaymentHandler = async () => {
        if (!window.confirm('Bạn có chắc muốn thanh toán Online ngay bây giờ?')) return;
        setPaymentProcessing(true);
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/pay`, {}, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert('Thanh toán (Online) thành công! Bếp sẽ bắt đầu làm món.');
            window.location.reload();
        } catch (error) {
            alert('Thanh toán thất bại. Vui lòng thử lại.');
            setPaymentProcessing(false);
        }
    };

    const cashPaymentHandler = async () => {
        if (!window.confirm('Xác nhận thanh toán khi nhận hàng (COD)?')) return;
        setPaymentProcessing(true);
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: 'Processing' }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            alert('Đã xác nhận đơn hàng! Vui lòng chuẩn bị tiền mặt khi nhận hàng.');
            window.location.reload();
        } catch (error) {
            alert('Lỗi khi xác nhận đơn hàng.');
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
            setPaymentProcessing(false);
        }
    };

<<<<<<< HEAD
    const cashPaymentHandler = async () => {
        if (!window.confirm('Xác nhận đặt hàng (Thanh toán khi nhận)?')) return;
        setPaymentProcessing(true);
        try {
            await axios.put(`${API_URL}/api/orders/${orderId}/status`,
                { status: 'PAID_WAITING_PROCESS' },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            alert('Đã xác nhận đơn hàng!');
        } catch (error) {
            alert('Lỗi xác nhận.');
            setPaymentProcessing(false);
        }
    };

    // Helper: Progress Bar
    const getProgressWidth = () => {
        if (!order) return '0%';
        const s = order.status;
        if (s === 'DELIVERED' || s === 'Delivered') return '100%';
        if (s === 'SHIPPING' || s === 'Shipped') return '80%';
        if (s === 'READY_TO_SHIP') return '60%';
        if (s === 'PREPARING' || s === 'Processing') return '40%';
        if (s === 'PAID_WAITING_PROCESS' || s === 'Pending') return '20%';
        return '5%';
    };

=======
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="text-center mt-8 text-red-500 font-bold">{error}</div>;
    if (!order) return <p className="text-center mt-8">Không tìm thấy đơn hàng.</p>;

<<<<<<< HEAD
    const statusMsg = renderStatusMessage();

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">

                {/* --- SỬA: NÚT QUAY LẠI THÔNG MINH --- */}
                <Link
                    to={isAdmin ? "/admin/orderlist" : "/myorders"}
                    className="text-gray-500 hover:text-indigo-600 font-medium flex items-center mb-4 md:mb-0 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    {isAdmin ? "Quản lý đơn hàng" : "Quay lại danh sách"}
                </Link>
                {/* ------------------------------------ */}

=======
    // Helper để xác định step trạng thái
    const getStepClass = (step) => {
        const status = order.status || 'Pending';
        const steps = { 'Pending': 0, 'Processing': 1, 'Shipped': 2, 'Delivered': 3, 'Cancelled': -1 };
        const currentStep = steps[status];
        if (currentStep === -1) return 'text-red-500 font-bold'; // Đã hủy
        return step <= currentStep ? 'text-indigo-600 font-bold' : 'text-gray-400';
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header & Back Link */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <Link
                    to={userInfo.isAdmin ? "/admin/orderlist" : "/myorders"}
                    className="text-gray-500 hover:text-indigo-600 font-medium flex items-center mb-4 md:mb-0 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Quay lại danh sách
                </Link>
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                    Đơn hàng <span className="text-indigo-600">#{order._id.substring(0, 8)}</span>
                </h1>
            </div>

<<<<<<< HEAD
            {/* --- 1. THANH TRẠNG THÁI LỚN --- */}
            <div className={`p-4 rounded-xl shadow-sm mb-6 flex items-center justify-center gap-3 border ${statusMsg.color}`}>
                <span className="text-3xl">{statusMsg.icon}</span>
                <span className="font-bold text-lg">{statusMsg.text}</span>
            </div>

            {/* --- 2. PROGRESS BAR --- */}
            {order.status !== 'CANCELLED' && order.status !== 'Cancelled' && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
                    <div className="flex justify-between text-xs md:text-sm text-center font-medium text-gray-500 mb-2">
                        <span>Đặt hàng</span>
                        <span>Chuẩn bị</span>
                        <span>Giao hàng</span>
                        <span>Hoàn tất</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                            style={{ width: getProgressWidth() }}>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">

                    {/* --- 3. THÔNG TIN CHI NHÁNH --- */}
                    {branchInfo && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <div className="flex items-start">
                                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Cửa hàng xử lý</h2>
                                    <p className="text-indigo-600 font-bold text-lg mt-1">{branchInfo.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">📍 {branchInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- 4. THÔNG TIN GIAO HÀNG & DRONE --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-2 rounded-full mr-3"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
                            <h2 className="text-xl font-bold text-gray-800">Nơi nhận hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 pl-2">
                            <p><span className="font-semibold text-gray-800">Người nhận:</span> {userInfo?.name}</p>
                            <p><span className="font-semibold text-gray-800">SĐT:</span> {order.shippingAddress?.phone || userInfo?.phone}</p>
                            <p className="md:col-span-2"><span className="font-semibold text-gray-800">Địa chỉ:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        </div>

                        {/* HIỂN THỊ GHI CHÚ ĐƠN HÀNG */}
                        {order.note && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                                <span className="text-xl mr-2">📝</span>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Ghi chú cho đơn hàng:</p>
                                    <p className="text-gray-700 italic text-sm mt-1">"{order.note}"</p>
                                </div>
                            </div>
                        )}

                        {/* KHỐI BẢN ĐỒ / DRONE */}
                        {(order.status === 'SHIPPING' || order.status === 'Shipped' || order.status === 'DELIVERED' || order.status === 'Delivered') ? (
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <span className="text-3xl mr-3">🚁</span>
                                        <div>
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Live Tracking</p>
                                            <p className="font-bold text-gray-800">Drone ID: {order.droneId || 'Alpha-01'}</p>
                                        </div>
                                    </div>
                                    <Link to={`/track/${order._id}`} className="px-4 py-2 bg-white text-blue-600 font-bold rounded shadow-sm hover:bg-blue-50 text-sm">
                                        Xem bản đồ lớn
                                    </Link>
                                </div>
                                
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-400 italic text-sm">
                                Bản đồ theo dõi sẽ hiện khi Drone bắt đầu giao hàng.
                            </div>
                        )}
                    </div>

                    {/* --- 5. CHI TIẾT MÓN ĂN --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Chi tiết món ăn</h2>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item, index) => {
                                const quantity = item.qty || item.quantity || 0;
                                const price = item.price || 0;

                                return (
                                    <div key={item._id || index} className="py-4 flex justify-between items-start">
                                        <div className="flex items-start">
                                            {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200" onError={(e) => e.target.style.display = 'none'} />}
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                                                <p className="text-sm text-gray-500">Số lượng: <span className="font-bold text-gray-800">x{quantity}</span></p>
                                                {item.selectedOptions?.length > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                                                        {item.selectedOptions.map(opt => `+ ${opt.name}`).join(', ')}
                                                    </div>
                                                )}
                                                {item.note && <p className="text-xs text-gray-400 italic mt-1">Ghi chú: "{item.note}"</p>}
                                            </div>
                                        </div>
                                        <span className="font-bold text-indigo-600 text-lg">{(price * quantity).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: THANH TOÁN */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-50 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tổng thanh toán</h2>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span><span>{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí giao hàng</span><span className="text-green-600 font-bold">Miễn phí</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-lg">Tổng cộng</span>
                                <span className="font-bold text-indigo-600 text-xl">{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>

                        {/* Logic hiển thị nút thanh toán */}
                        {(order.status === 'PENDING_PAYMENT' || (order.status === 'Pending' && !order.isPaid)) ? (
                            <div className="space-y-3 mt-4">
                                {/* SỬA: CHỈ HIỆN NÚT THANH TOÁN NẾU KHÔNG PHẢI ADMIN */}
                                {!isAdmin ? (
                                    <>
                                        <button onClick={onlinePaymentHandler} disabled={paymentProcessing} className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-50">
                                            {paymentProcessing ? 'Đang xử lý...' : '💳 Thanh toán Online'}
                                        </button>
                                        <button onClick={cashPaymentHandler} disabled={paymentProcessing} className="w-full py-3 px-4 bg-white text-gray-700 font-bold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex justify-center items-center disabled:opacity-50">
                                            💵 Tiền mặt (COD)
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-2">
                                            Vui lòng thanh toán để nhà hàng xác nhận đơn.
                                        </p>
                                    </>
                                ) : (
                                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-center border border-yellow-200 font-medium">
                                        Khách hàng chưa thanh toán
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center mb-4 border border-green-200 mt-4">
                                <div className="flex justify-center mb-2"><svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                                <p className="font-bold">
                                    {order.isPaid ? 'Đã thanh toán thành công' : 'Đã xác nhận phương thức COD'}
                                </p>
                                <p className="text-xs mt-1 opacity-80">Đơn hàng đang được xử lý</p>
                            </div>
                        )}

                        
=======
            {/* Progress Bar (Trạng thái đơn) */}
            {order.status !== 'Cancelled' && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
                    <div className="flex justify-between text-sm md:text-base text-center">
                        <div className={getStepClass(0)}>1. Đã đặt</div>
                        <div className={getStepClass(1)}>2. Đang chuẩn bị</div>
                        <div className={getStepClass(2)}>3. Đang giao</div>
                        <div className={getStepClass(3)}>4. Hoàn tất</div>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-indigo-500 transition-all duration-1000`} style={{
                            width: order.status === 'Delivered' ? '100%' :
                                order.status === 'Shipped' ? '75%' :
                                    order.status === 'Processing' ? '50%' : '25%'
                        }}></div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
                <div className="md:col-span-2 space-y-6">

                    {/* --- KHỐI MỚI: THÔNG TIN CỬA HÀNG --- */}
                    {branchInfo && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <div className="flex items-start">
                                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Thông tin cửa hàng</h2>
                                    <p className="text-indigo-600 font-bold text-lg mt-1">{branchInfo.name}</p>
                                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                                        <p className="flex items-center">
                                            <span className="mr-2">📍</span> {branchInfo.address}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="mr-2">📞</span> {branchInfo.phoneNumber || 'Đang cập nhật'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Thông tin giao hàng */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Thông tin nhận hàng</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <p><span className="font-semibold text-gray-800">Người nhận:</span> {userInfo?.name}</p>
                            <p><span className="font-semibold text-gray-800">Email:</span> {userInfo?.email}</p>
                            <p><span className="font-semibold text-gray-800">SĐT:</span> {userInfo?.phone || 'Chưa cập nhật'}</p>
                            <p className="md:col-span-2"><span className="font-semibold text-gray-800">Địa chỉ:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        </div>

                        {/* Drone Info */}
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-3xl mr-3">🚁</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Phương tiện giao hàng</p>
                                    <p className="font-bold text-gray-800 text-lg">
                                        {order.droneId ? `Drone ID: ${order.droneId}` : 'Đang điều phối Drone...'}
                                    </p>
                                </div>
                            </div>
                            {order.droneId && (
                                <Link to={`/track/${order._id}`} className="px-4 py-2 bg-white text-blue-600 font-bold rounded shadow-sm hover:bg-blue-50 transition text-sm">
                                    Xem vị trí
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Danh sách món ăn */}
                    {/* --- KHỐI CHI TIẾT MÓN ĂN (ĐÃ SỬA LỖI NAN & X) --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Chi tiết món ăn</h2>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item, index) => {
                                // --- LOGIC QUAN TRỌNG ĐỂ FIX LỖI ---
                                const quantity = item.qty || item.quantity || 0; // Lấy qty HOẶC quantity
                                const price = item.price || 0;
                                // -----------------------------------

                                return (
                                    <div key={item._id || index} className="py-4 flex justify-between items-start">
                                        <div className="flex items-start">
                                            {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200" onError={(e) => e.target.style.display = 'none'} />}
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">{item.name}</p>

                                                {/* Hiển thị số lượng đã fix */}
                                                <p className="text-sm text-gray-500">
                                                    Số lượng: <span className="font-bold text-gray-800">x{quantity}</span>
                                                </p>

                                                {item.selectedOptions?.length > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                                                        {item.selectedOptions.map(opt => `+ ${opt.name}`).join(', ')}
                                                    </div>
                                                )}
                                                {item.note && <p className="text-xs text-gray-400 italic mt-1">Ghi chú: "{item.note}"</p>}
                                            </div>
                                        </div>

                                        {/* Hiển thị giá đã fix */}
                                        <span className="font-bold text-indigo-600 text-lg">
                                            {(price * quantity).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: THANH TOÁN */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-50 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tổng thanh toán</h2>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí giao hàng</span>
                                <span className="text-green-600 font-bold">Miễn phí</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-lg">Tổng cộng</span>
                                <span className="font-bold text-indigo-600 text-xl">{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>

                        {/* Trạng thái thanh toán */}
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center mb-4 border border-green-200">
                                <div className="flex justify-center mb-2">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <p className="font-bold">Đã thanh toán thành công</p>
                                <p className="text-xs mt-1 opacity-80">Vào lúc: {new Date(order.paidAt).toLocaleTimeString('vi-VN')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2">Chọn phương thức:</h3>

                                {/* Nút Thanh toán Online */}
                                <button
                                    onClick={onlinePaymentHandler}
                                    disabled={paymentProcessing || order.status === 'Cancelled'}
                                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-50"
                                >
                                    {paymentProcessing ? 'Đang xử lý...' : '💳 Thanh toán Online'}
                                </button>

                                {/* Nút Tiền mặt (COD) */}
                               

                                {order.status === 'Cancelled' && (
                                    <p className="text-center text-red-500 text-sm font-bold mt-2">Đơn hàng đã bị hủy</p>
                                )}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <Link to={`/track/${order._id}`} className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"></path></svg>
                                Theo dõi lộ trình
=======
    }, [orderId, userInfo]); // Depend on userInfo as well

    const paymentHandler = async () => {
        setPaymentProcessing(true); // Disable button
        try {
            // Call Payment Service via API Gateway
            await axios.post('http://localhost:3000/api/payments', { orderId });
            alert('Thanh toán thành công! Đang chuyển đến trang theo dõi...');
            navigate(`/track/${orderId}`); // Navigate to tracking page
        } catch (error) {
            alert('Thanh toán thất bại. Vui lòng thử lại.');
            console.error("Payment error:", error);
            setPaymentProcessing(false); // Re-enable button on failure
        }
        // No need to setPaymentProcessing(false) on success because we navigate away
    };

    if (loading) return <p className="text-center mt-8">Đang tải đơn hàng...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!order) return <p className="text-center mt-8">Không tìm thấy đơn hàng.</p>; // Handle case where order is null

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Chi tiết Đơn hàng #{order._id}</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Shipping & Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">Thông tin giao hàng</h2>
                        <p><span className="font-medium">Người nhận:</span> {userInfo?.name}</p> {/* Assuming userInfo has name */}
                        <p><span className="font-medium">Email:</span> {userInfo?.email}</p> {/* Assuming userInfo has email */}
                        <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">Các món đã đặt</h2>
                        {order.orderItems.map(item => (
                            <div key={item.productId || item._id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                <div className="flex items-center">
                                    {/* <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" /> Optional Image */}
                                    <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                </div>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary & Payment */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4"> {/* Added sticky top */}
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tóm tắt đơn hàng</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền hàng</span>
                                <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phí giao hàng</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                <span>Tổng cộng</span>
                                <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        </div>

                        {/* Payment Status and Button */}
                        <div className="mt-6 text-center">
                            {order.isPaid ? (
                                <div className="p-3 bg-green-100 text-green-700 rounded-md">
                                    Đã thanh toán vào {new Date(order.paidAt).toLocaleTimeString('vi-VN')} {new Date(order.paidAt).toLocaleDateString('vi-VN')}
                                </div>
                            ) : (
                                <button
                                    onClick={paymentHandler}
                                    disabled={paymentProcessing}
                                    className={`w-full py-3 font-semibold text-white rounded-md transition duration-200 ${paymentProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán ngay (Giả lập)'}
                                </button>
                            )}
                        </div>

                        {/* Link to Tracking Page */}
                        <div className="mt-4 text-center">
                            <Link to={`/track/${order._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Xem lộ trình giao hàng &rarr;
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                            </Link>
                        </div>
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;