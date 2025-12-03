import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const UserListAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useContext(AuthContext);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // 1. Khai báo URL (nếu chưa có trong component)
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            // 2. Sửa dòng gọi API
            const { data } = await axios.get(`${API_URL}/api/users`, config);            setUsers(data);
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchUsers();
        }
    }, [userInfo]);

    const deleteHandler = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`http://localhost:3000/api/users/${id}`, config);
                fetchUsers(); // Tải lại danh sách sau khi xóa
            } catch (error) {
                alert('Xóa người dùng thất bại.');
            }
        }
    };

    if (loading) return <p className="text-center mt-8">Đang tải danh sách người dùng...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Quản lý Người Dùng</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">TÊN</th>
                            <th className="px-6 py-3">EMAIL</th>
                            <th className="px-6 py-3">SĐT</th>
                            <th className="px-6 py-3">ADMIN</th>
                            <th className="px-6 py-3">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{user._id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phone || '-'}</td>
                                <td className="px-6 py-4">
                                    {user.isAdmin ? (
                                        <span className="text-green-600 font-bold">YES</span>
                                    ) : (
                                        <span className="text-gray-500">NO</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => deleteHandler(user._id)} className="font-medium text-red-600 hover:underline" disabled={user.isAdmin}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListAdminPage;