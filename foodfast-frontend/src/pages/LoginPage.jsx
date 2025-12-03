// src/pages/LoginPage.jsx

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Thêm state loading

    const { userInfo, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { search } = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    // 1. XỬ LÝ NẾU ĐÃ ĐĂNG NHẬP SẴN (Vào lại trang login khi đã có session)
    useEffect(() => {
        if (userInfo) {
            if (userInfo.isAdmin) {
                navigate('/admin/orderlist'); // Admin về trang quản lý
            } else {
                navigate(redirect); // User thường về trang chủ/trang trước đó
            }
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Bắt đầu loading

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });

            // Lưu thông tin vào Context
            login(data);

            // 2. XỬ LÝ CHUYỂN HƯỚNG NGAY SAU KHI LOGIN THÀNH CÔNG
            if (data.isAdmin) {
                console.log("👨‍💼 Admin logged in -> Chuyển đến trang Quản lý");
                navigate("./admin/orderlist");
            } else {
                console.log("👤 User logged in -> Chuyển đến trang chủ");
                navigate(redirect);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không hợp lệ.');
        } finally {
            setLoading(false); // Tắt loading
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Đăng Nhập</h1>
                    <p className="mt-2 text-sm text-gray-600">Chào mừng quay trở lại FoodFast</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Địa chỉ Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            'Đăng Nhập'
                        )}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;   