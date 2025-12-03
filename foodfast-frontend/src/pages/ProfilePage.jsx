import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { userInfo, login } = useContext(AuthContext); // Lấy hàm 'login' để cập nhật context
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy thông tin user hiện tại khi tải trang
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            // Dùng API để lấy thông tin mới nhất
            const fetchProfile = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    const { data } = await axios.get('http://localhost:3000/api/users/profile', config);
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone || '');
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || 'Không thể tải thông tin');
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const updateData = { name, email, phone };
            if (password) {
                updateData.password = password;
            }

            const { data } = await axios.put(
                'http://localhost:3000/api/users/profile',
                updateData,
                config
            );

            // CẬP NHẬT LẠI CONTEXT
            login(data); // Cập nhật thông tin mới (bao gồm token mới nếu có)

            setSuccess('Cập nhật thông tin thành công!');
            setPassword('');
            setConfirmPassword('');

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    if (loading) return <p className="text-center mt-8">Đang tải thông tin...</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Thông Tin Cá Nhân</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full mt-1 border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full mt-1 border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <hr className="my-4" />
                    <p className="text-sm text-gray-500">Để trống nếu không muốn đổi mật khẩu:</p>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 border border-gray-300 rounded-md p-2 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 border border-gray-300 rounded-md p-2 shadow-sm" />
                    </div>

                    <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Cập Nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;