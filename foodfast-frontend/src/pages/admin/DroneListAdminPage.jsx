import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const DroneListAdminPage = () => {
    const { userInfo } = useContext(AuthContext);
    const [drones, setDrones] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    // State kiểm tra kết nối Socket
    const [socketConnected, setSocketConnected] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDrone, setEditingDrone] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        model: 'DJI Delivery X1',
        status: 'Idle',
        batteryLevel: 100,
        branchId: userInfo.branchId || ''
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    // Sử dụng biến môi trường chuẩn
    const DELIVERY_SOCKET_URL = import.meta.env.VITE_DELIVERY_SOCKET_URL || 'http://localhost:3005';

    const isSuperAdmin = !userInfo?.branchId;

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                const branchQuery = userInfo.branchId ? `?branchId=${userInfo.branchId}` : '';
                const { data: droneData } = await axios.get(`${API_URL}/api/drones${branchQuery}`, config);
                setDrones(droneData);

                if (isSuperAdmin) {
                    const { data: branchData } = await axios.get(`${API_URL}/api/branches`);
                    setBranches(branchData);
                }
            } catch (err) {
                console.error("Error fetching data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userInfo, API_URL, isSuperAdmin]);

    // 2. SOCKET REAL-TIME (Quan trọng)
    useEffect(() => {
        console.log("🔌 Connecting to Delivery Socket:", DELIVERY_SOCKET_URL);

        const socket = io(DELIVERY_SOCKET_URL, {
            transports: ['websocket'], // Bắt buộc dùng websocket để ổn định
        });

        socket.on('connect', () => {
            console.log('✅ Socket Connected ID:', socket.id);
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket Disconnected');
            setSocketConnected(false);
        });

        // Lắng nghe sự kiện update
        socket.on('drone_update', (updatedDrone) => {
            console.log('🚁 RECEIVED DRONE UPDATE:', updatedDrone);
            setDrones((prevDrones) => {
                // Nếu admin chi nhánh, chỉ cập nhật drone của mình
                if (!isSuperAdmin && updatedDrone.branchId !== userInfo.branchId) return prevDrones;

                const index = prevDrones.findIndex(d => d._id === updatedDrone._id);
                if (index !== -1) {
                    // Cập nhật item cũ
                    const newDrones = [...prevDrones];
                    newDrones[index] = updatedDrone;
                    return newDrones;
                } else {
                    // Thêm mới
                    return [...prevDrones, updatedDrone];
                }
            });
        });

        socket.on('drone_deleted', (droneId) => {
            setDrones(prev => prev.filter(d => d._id !== droneId));
        });

        return () => socket.disconnect();
    }, [DELIVERY_SOCKET_URL, isSuperAdmin, userInfo.branchId]);

    // ... (Các hàm xử lý Form giữ nguyên) ...
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const openModal = (drone = null) => {
        if (drone) {
            setEditingDrone(drone);
            setFormData({ ...drone });
        } else {
            setEditingDrone(null);
            setFormData({ name: '', model: 'DJI Delivery X1', status: 'Idle', batteryLevel: 100, branchId: userInfo.branchId || (branches[0]?._id || '') });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            if (editingDrone) {
                await axios.put(`${API_URL}/api/drones/${editingDrone._id}`, formData, config);
            } else {
                await axios.post(`${API_URL}/api/drones`, formData, config);
            }
            setIsModalOpen(false);
            // Không reload trang, chờ Socket cập nhật
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa Drone?")) {
            try {
                await axios.delete(`${API_URL}/api/drones/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
            } catch (err) { alert("Lỗi xóa"); }
        }
    };

    // Helper UI
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Idle': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Rảnh</span>;
            case 'Delivering': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold animate-pulse">Đang giao</span>;
            case 'Returning': return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">Đang về</span>;
            case 'Charging': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Đang sạc</span>;
            default: return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Bảo trì</span>;
        }
    };

    const getBatteryIcon = (level) => {
        let color = 'text-green-500';
        let bg = 'bg-green-500';
        if (level < 50) { color = 'text-yellow-500'; bg = 'bg-yellow-500'; }
        if (level < 20) { color = 'text-red-500'; bg = 'bg-red-500'; }
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-3 border border-gray-300 rounded-sm relative overflow-hidden bg-gray-100">
                    <div className={`h-full ${bg}`} style={{ width: `${level}%` }}></div>
                </div>
                <span className={`text-xs font-bold ${color}`}>{level}%</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">Quản Lý Đội Bay</h1>
                    {/* Chỉ báo kết nối Socket */}
                    <span
                        className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}
                        title={socketConnected ? "Đã kết nối thời gian thực" : "Mất kết nối Socket"}
                    ></span>
                </div>
                <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                    + Thêm Drone
                </button>
            </div>

            {loading ? <div className="text-center">Đang tải...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drones.map(drone => (
                        <div key={drone._id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition relative">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{drone.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold">{drone.model}</p>
                                </div>
                                {getStatusBadge(drone.status)}
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between"><span>Pin:</span> {getBatteryIcon(drone.batteryLevel)}</div>
                                <div className="flex justify-between"><span>Chi nhánh:</span>
                                    <span className="font-bold text-indigo-600">
                                        {branches.find(b => b._id === drone.branchId)?.name || (drone.branchId ? '...' + drone.branchId.slice(-4) : '---')}
                                    </span>
                                </div>
                                <div className="flex justify-between bg-gray-50 p-2 rounded">
                                    <span>Đơn hàng:</span>
                                    <span className="font-mono font-bold">{drone.currentOrderId ? `#${drone.currentOrderId.slice(-6)}` : '---'}</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-3">
                                <button onClick={() => openModal(drone)} className="text-blue-600 text-sm font-bold hover:underline">Sửa</button>
                                <button onClick={() => handleDelete(drone._id)} className="text-red-600 text-sm font-bold hover:underline">Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingDrone ? 'Cập nhật' : 'Thêm Mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            {/* ... (Các input giữ nguyên như cũ) ... */}
                            <div className="mb-3"><label className="block text-sm font-bold">Tên</label><input name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            {isSuperAdmin && <div className="mb-3"><label className="block text-sm font-bold">Chi nhánh</label><select name="branchId" value={formData.branchId} onChange={handleInputChange} className="w-full border p-2 rounded"><option value="">Chọn CN</option>{branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>}
                            <div className="flex gap-2 mb-3">
                                <div className="w-1/2"><label className="block text-sm font-bold">Pin</label><input type="number" name="batteryLevel" value={formData.batteryLevel} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                                <div className="w-1/2"><label className="block text-sm font-bold">Trạng thái</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full border p-2 rounded"><option value="Idle">Rảnh</option><option value="Delivering">Đang giao</option><option value="Charging">Sạc</option></select></div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DroneListAdminPage;