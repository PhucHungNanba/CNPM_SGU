<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
﻿import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

// --- Import Components ---
import Header from './components/Header.jsx';
import BranchModal from './components/BranchModal';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// --- Import Pages (Khách hàng) ---
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';       // <--- Đảm bảo file này tồn tại
import RegisterPage from './pages/RegisterPage.jsx'; // <--- Đảm bảo file này tồn tại
<<<<<<< HEAD
=======
=======
﻿import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx'; // Đảm bảo import đúng

// --- Page Imports ---
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
import CartPage from './pages/CartPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
import ProfilePage from './pages/ProfilePage.jsx';

// --- Import Pages (Admin) ---
import ProductListAdminPage from './pages/admin/ProductListAdminPage.jsx';
import ProductEditPage from './pages/admin/ProductEditPage.jsx';
import OrderListAdminPage from './pages/admin/OrderListAdminPage.jsx';
import UserListAdminPage from './pages/admin/UserListAdminPage.jsx';
import BranchListAdminPage from './pages/admin/BranchListAdminPage.jsx';
<<<<<<< HEAD
import DroneListAdminPage from './pages/admin/DroneListAdminPage.jsx';
=======
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

function App() {
    const { userInfo } = useContext(AuthContext);

    // State quản lý chi nhánh và Modal
    const [currentBranch, setCurrentBranch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm xử lý khi chọn xong chi nhánh
    const handleBranchSelected = (branch) => {
        setCurrentBranch(branch);
        setIsModalOpen(false);
    };

    // Hàm mở modal (khi bấm nút Đổi)
    const handleOpenBranchModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header truyền state chi nhánh xuống */}
            <Header
                currentBranch={currentBranch}
                onChangeBranch={handleOpenBranchModal}
            />

            {/* --- THANH THÔNG BÁO CHI NHÁNH --- */}
            {/* Chỉ hiện khi đã chọn chi nhánh và KHÔNG phải là Admin */}
            {currentBranch && !userInfo?.isAdmin && (
                <div className="bg-indigo-600 text-white py-3 px-4 shadow-md relative z-20">
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center text-sm">
                            <div className="bg-white/20 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <span className="opacity-90 block text-xs uppercase tracking-wider font-semibold">Đang giao hàng từ:</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-yellow-300 text-lg leading-none">
                                        {currentBranch.name}
                                    </span>
                                    <span className="hidden md:inline opacity-80 text-xs">
                                        — {currentBranch.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenBranchModal}
                            className="group bg-white text-indigo-700 hover:bg-yellow-300 hover:text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm flex items-center whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 mr-1.5 text-indigo-500 group-hover:text-indigo-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                            Đổi Chi Nhánh Khác
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL CHỌN CHI NHÁNH --- */}
            {(!userInfo?.isAdmin) && (
                <BranchModal
                    onBranchSelected={handleBranchSelected}
                    forceOpen={isModalOpen}
                />
            )}

            <main className="py-3 flex-grow container mx-auto px-4">
                <Routes>
                    {/* --- ROUTES CÔNG KHAI (Public) --- */}
                    <Route
                        path="/"
                        element={userInfo && userInfo.isAdmin ? <Navigate to="/admin/productlist" replace /> : <HomePage />}
                    />
<<<<<<< HEAD
=======
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* QUAN TRỌNG: Đảm bảo 2 dòng này có mặt */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* --- ROUTES CẦN ĐĂNG NHẬP (User) --- */}
=======

// --- Admin Page Imports ---
import ProductListAdminPage from './pages/admin/ProductListAdminPage.jsx';
import ProductEditPage from './pages/admin/ProductEditPage.jsx';
import OrderListAdminPage from './pages/admin/OrderListAdminPage.jsx';

// --- Component Imports ---
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
    const { userInfo } = useContext(AuthContext); // Lấy thông tin user

    return (
        <div>
            <Header />
            <main className="py-3">
                <Routes>
                    {/* --- Home Route --- */}
                    {/* Logic để ẩn trang chủ cho admin */}
                    <Route
                        path="/"
                        element={
                            // Nếu đã đăng nhập VÀ là admin, chuyển hướng đến trang quản lý sản phẩm
                            userInfo && userInfo.isAdmin ? (
                                <Navigate to="/admin/productlist" replace />
                            ) : (
                                // Nếu không phải admin hoặc chưa đăng nhập, hiển thị trang chủ
                                <HomePage />
                            )
                        }
                    />

                    {/* --- Các Route còn lại giữ nguyên --- */}
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                    <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                    <Route path="/myorders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                    <Route path="/track/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
<<<<<<< HEAD
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

<<<<<<< HEAD
                    {/* QUAN TRỌNG: Đảm bảo 2 dòng này có mặt */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* --- ROUTES CẦN ĐĂNG NHẬP (User) --- */}
                    <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                    <Route path="/myorders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                    <Route path="/track/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

=======
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                    {/* --- ROUTES ADMIN --- */}
                    <Route path="/admin/orderlist" element={<AdminRoute><OrderListAdminPage /></AdminRoute>} />
                    <Route path="/admin/productlist" element={<AdminRoute><ProductListAdminPage /></AdminRoute>} />
                    <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    <Route path="/admin/product/create" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    <Route path="/admin/userlist" element={<AdminRoute><UserListAdminPage /></AdminRoute>} />
                    <Route path="/admin/branchlist" element={<AdminRoute><BranchListAdminPage /></AdminRoute>} />
<<<<<<< HEAD
                    <Route path="/admin/drones" element={<AdminRoute><DroneListAdminPage /></AdminRoute>} />
=======
=======
                    <Route path="/admin/productlist" element={<AdminRoute><ProductListAdminPage /></AdminRoute>} />
                    <Route path="/admin/orderlist" element={<AdminRoute><OrderListAdminPage /></AdminRoute>} />
                    <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    <Route path="/admin/product/create" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
                </Routes>
            </main>
        </div>
    );
}

export default App;