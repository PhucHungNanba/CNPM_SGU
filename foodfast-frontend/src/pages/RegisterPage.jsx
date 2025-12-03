import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Đã bỏ đuôi .jsx

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(''); // <-- 1. Thêm state cho SĐT
    const [error, setError] = useState(null);

    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const { search } = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // 2. Gửi 'phone' lên backend
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, { name, email, password, phone });
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate(`/login?redirect=${redirect}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">Tạo tài khoản</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Tên */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên của bạn
                        </label>
                        <input
                            type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Địa chỉ Email
                        </label>
                        <input
                            type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* --- 3. THÊM Ô NHẬP SĐT --- */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </label>
                        <input
                            type="tel" // Dùng type="tel" cho SĐT
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required // Đặt là `false` nếu không bắt buộc
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    {/* --------------------- */}

                    {/* Mật khẩu */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Đăng Ký
                    </button>
                </form>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to={`/login?redirect=${redirect}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;