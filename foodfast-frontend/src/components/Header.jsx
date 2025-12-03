import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = ({ currentBranch, onChangeBranch }) => {
    const { userInfo, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    // Kiểm tra xem có phải Admin tổng không (không có branchId)
    const isSuperAdmin = userInfo?.isAdmin && !userInfo.branchId;

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* --- LOGO --- */}
                <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tighter">
                    FoodFast<span className="text-yellow-500">.</span>
                </Link>

                {/* --- MENU --- */}
                <div className="flex items-center space-x-6">

                    {/* 1. HIỂN THỊ CHI NHÁNH (Chỉ hiện cho Khách hàng, Admin ẩn đi cho gọn) */}
                    {currentBranch && !userInfo?.isAdmin && (
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-xs text-gray-500 mr-2">Đang giao từ:</span>
                            <span className="text-sm font-bold text-indigo-700 truncate max-w-[150px]">
                                {currentBranch.name}
                            </span>
                            <button
                                onClick={onChangeBranch}
                                className="ml-2 text-xs text-blue-500 hover:underline"
                            >
                                (Đổi)
                            </button>
                        </div>
                    )}

                    {/* Icon Giỏ hàng (Ẩn với Admin) */}
                    {!userInfo?.isAdmin && (
                        <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </Link>
                    )}

                    {userInfo ? (
                        <div className="relative group">
                            <button className="flex items-center text-gray-700 font-medium hover:text-indigo-600 focus:outline-none">
                                <span className="mr-1">
                                    {userInfo.name}
                                    {/* Hiển thị vai trò nhỏ bên cạnh tên */}
                                    {userInfo.isAdmin && (
                                        <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                            {isSuperAdmin ? 'Super Admin' : 'Manager'}
                                        </span>
                                    )}
                                </span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* DROPDOWN MENU */}
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">

                                {/* 2. LOGIC ẨN HIỆN MENU USER */}
                                {/* Chỉ hiện Hồ sơ & Đơn mua nếu KHÔNG PHẢI LÀ ADMIN */}
                                {!userInfo.isAdmin && (
                                    <>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ của tôi</Link>
                                        <Link to="/myorders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đơn mua</Link>
                                    </>
                                )}

                                {/* 3. LOGIC ẨN HIỆN MENU ADMIN */}
                                {userInfo.isAdmin && (
                                    <>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase">Quản lý</div>

                                        {/* Mục này hiện cho TẤT CẢ Admin (Cả Super và Branch Manager) */}
                                        <Link to="/admin/orderlist" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-semibold">📦 Quản lý Đơn hàng</Link>

                                        {/* Các mục này CHỈ hiện cho SUPER ADMIN */}
                                        {isSuperAdmin && (
                                            <>
                                                <Link to="/admin/productlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🍔 Quản lý Món ăn</Link>
                                                <Link to="/admin/userlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">👥 Quản lý Người dùng</Link>
                                                <Link to="/admin/branchlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🏢 Quản lý Chi nhánh</Link>
                                                <Link to="/admin/drones" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">🚁 Quản lý Drone</Link>
                                            </>
                                        )}
                                    </>
                                )}
                                
                                <div className="border-t border-gray-200 my-1"></div>
                                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-x-2">
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Đăng nhập</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;