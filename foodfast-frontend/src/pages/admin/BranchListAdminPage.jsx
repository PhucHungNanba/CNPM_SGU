import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BranchListAdminPage = () => {
    const { userInfo } = useContext(AuthContext);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);

    // State Form Chi Nhánh
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        lng: '',
        phoneNumber: '',
        operatingHours: '8:00 - 22:00'
    });

    // State Form Admin (Mới)
    const [createAdmin, setCreateAdmin] = useState(false);
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/branches`);
            setBranches(data);
        } catch (err) {
            alert('Lỗi tải danh sách chi nhánh');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const openModal = (branch = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                address: branch.address,
                lng: branch.location?.coordinates[0] || '',
                lat: branch.location?.coordinates[1] || '',
                phoneNumber: branch.phoneNumber || '',
                operatingHours: branch.operatingHours || ''
            });
            setCreateAdmin(false);
        } else {
            setEditingBranch(null);
            setFormData({ name: '', address: '', lat: '', lng: '', phoneNumber: '', operatingHours: '8:00 - 22:00' });
            setCreateAdmin(false);
            setAdminData({ name: '', email: '', password: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- BẮT ĐẦU: KIỂM TRA TRÙNG TÊN ---
        const inputName = formData.name.trim().toLowerCase();

        const isDuplicate = branches.some(branch => {
            // Nếu đang ở chế độ Sửa (editingBranch != null)
            // thì bỏ qua chi nhánh có cùng _id với chi nhánh đang sửa
            if (editingBranch && branch._id === editingBranch._id) {
                return false;
            }
            // So sánh tên
            return branch.name.trim().toLowerCase() === inputName;
        });

        if (isDuplicate) {
            alert(`Tên chi nhánh "${formData.name}" đã tồn tại! Vui lòng đặt tên khác.`);
            return; // Dừng hàm, không gửi request
        }
        // --- KẾT THÚC: KIỂM TRA TRÙNG TÊN ---

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const payload = {
                ...formData,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
                }
            };

            let branchId = '';

            if (editingBranch) {
                await axios.put(`${API_URL}/api/branches/${editingBranch._id}`, payload, config);
                alert('Cập nhật chi nhánh thành công!');
            } else {
                const { data: newBranch } = await axios.post(`${API_URL}/api/branches`, payload, config);
                branchId = newBranch._id;

                if (createAdmin && branchId) {
                    try {
                        await axios.post(`${API_URL}/api/users/register`, {
                            name: adminData.name,
                            email: adminData.email,
                            password: adminData.password,
                            isAdmin: true,
                            branchId: branchId
                        });
                        alert(`Đã tạo chi nhánh "${newBranch.name}" và tài khoản admin thành công!`);
                    } catch (userErr) {
                        console.error(userErr);
                        alert(`Tạo chi nhánh thành công nhưng lỗi khi tạo Admin: ${userErr.response?.data?.message}`);
                    }
                } else {
                    alert('Thêm chi nhánh thành công!');
                }
            }

            setIsModalOpen(false);
            fetchBranches();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    // --- [SỬA LỖI TẠI ĐÂY] ---
    const toggleStatusHandler = async (branch) => {
        const action = branch.isActive ? 'TẠM ĐÓNG CỬA' : 'MỞ CỬA LẠI';
        if (!window.confirm(`Bạn có chắc chắn muốn ${action} chi nhánh "${branch.name}" không?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // SỬA: Thay vì gọi /toggle-status, ta gọi PUT update thông thường
            // và gửi lên isActive đảo ngược
            await axios.put(
                `${API_URL}/api/branches/${branch._id}`,
                { isActive: !branch.isActive }, // Đảo ngược trạng thái: true -> false, false -> true
                config
            );

            alert(`Đã ${action.toLowerCase()} thành công!`);
            fetchBranches(); // Tải lại danh sách để cập nhật giao diện
        } catch (err) {
            alert('Lỗi cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
        }
    };
    // -------------------------

    // --- HÀM KIỂM TRA ĐƠN HÀNG ---
    const checkBranchHasOrders = async (branchId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders/all?branchId=${branchId}`, config);
            return data && data.length > 0;
        } catch (error) {
            console.error("Lỗi kiểm tra đơn hàng:", error);
            return false;
        }
    };

    // --- HÀM KIỂM TRA DRONE ---
    const checkBranchHasDrones = async (branchId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/drones?branchId=${branchId}`, config);
            return data && data.length > 0;
        } catch (error) {
            return false;
        }
    };

    // --- HÀM XÓA CHI NHÁNH ---
    const handleDelete = async (branch) => {
        if (!window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa chi nhánh "${branch.name}"?\n\nHành động này không thể hoàn tác!`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const hasOrders = await checkBranchHasOrders(branch._id);
            if (hasOrders) {
                alert(`❌ KHÔNG THỂ XÓA!\n\nChi nhánh này đang có dữ liệu đơn hàng. Việc xóa sẽ làm mất lịch sử giao dịch.\n\nVui lòng sử dụng chức năng "Tạm đóng cửa" thay thế.`);
                return;
            }

            const hasDrones = await checkBranchHasDrones(branch._id);
            if (hasDrones) {
                if (!window.confirm(`⚠️ CẢNH BÁO: Chi nhánh này đang sở hữu Drone. Nếu xóa, các Drone này sẽ bị mất liên kết.\n\nBạn có chắc chắn muốn tiếp tục?`)) return;
            }

            await axios.delete(`${API_URL}/api/branches/${branch._id}`, config);
            alert('Đã xóa chi nhánh thành công.');
            fetchBranches();

        } catch (err) {
            alert('Lỗi khi xóa chi nhánh: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản Lý Chi Nhánh</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-md transition-transform hover:scale-105">
                    <span className="mr-2 text-xl">+</span> Thêm Chi Nhánh
                </button>
            </div>

            {loading ? <div className="text-center py-10">Đang tải dữ liệu...</div> : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal border-b border-gray-200">
                                <th className="py-3 px-6 text-left">Tên Chi Nhánh</th>
                                <th className="py-3 px-6 text-left">Địa Chỉ</th>
                                <th className="py-3 px-6 text-center">Trạng Thái</th>
                                <th className="py-3 px-6 text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {branches.map((branch) => (
                                <tr key={branch._id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${!branch.isActive ? 'bg-gray-100' : ''}`}>
                                    <td className="py-3 px-6 text-left font-medium text-indigo-600">
                                        {branch.name}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <p className="truncate max-w-xs" title={branch.address}>{branch.address}</p>
                                        <p className="text-xs text-gray-400 mt-1">Hotline: {branch.phoneNumber || '---'}</p>
                                    </td>

                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => toggleStatusHandler(branch)}
                                            className={`py-1 px-3 rounded-full text-xs font-bold shadow-sm transition-all transform hover:scale-105 
                                                ${branch.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                            title="Bấm để thay đổi trạng thái"
                                        >
                                            {branch.isActive ? '🟢 Đang hoạt động' : '🔴 Tạm đóng cửa'}
                                        </button>
                                    </td>

                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-3">
                                            <button onClick={() => openModal(branch)} className="transform hover:text-indigo-500 hover:scale-110 transition" title="Chỉnh sửa">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>

                                            <button onClick={() => handleDelete(branch)} className="transform hover:text-red-500 hover:scale-110 transition" title="Xóa vĩnh viễn">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                            {editingBranch ? 'Cập nhật Chi Nhánh' : 'Thêm Chi Nhánh Mới'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Tên Chi Nhánh</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Vĩ độ (Lat)</label>
                                    <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} required placeholder="VD: 10.762" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Kinh độ (Lng)</label>
                                    <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} required placeholder="VD: 106.660" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
                                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Giờ mở cửa</label>
                                    <input type="text" name="operatingHours" value={formData.operatingHours} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            {!editingBranch && (
                                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <div className="flex items-center mb-4">
                                        <input
                                            id="createAdmin"
                                            type="checkbox"
                                            checked={createAdmin}
                                            onChange={(e) => setCreateAdmin(e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label htmlFor="createAdmin" className="ml-2 block text-sm font-bold text-indigo-900 cursor-pointer">
                                            Tạo tài khoản Quản lý (Admin) cho chi nhánh này?
                                        </label>
                                    </div>

                                    {createAdmin && (
                                        <div className="grid grid-cols-1 gap-4 animate-fade-in">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Tên Quản lý</label>
                                                <input type="text" name="name" value={adminData.name} onChange={handleAdminChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: Quản lý Quận 1" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Email đăng nhập</label>
                                                <input type="email" name="email" value={adminData.email} onChange={handleAdminChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="admin_q1@foodfast.com" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                                                <input type="password" name="password" value={adminData.password} onChange={handleAdminChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded shadow-sm transition-colors">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow-md transition-colors">
                                    {editingBranch ? 'Cập nhật' : 'Tạo Chi Nhánh'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchListAdminPage;