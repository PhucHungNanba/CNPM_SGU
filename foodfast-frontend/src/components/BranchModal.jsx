import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BranchModal = ({ onBranchSelected, forceOpen = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // URL API (Fallback về localhost nếu chưa cấu hình env)
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const savedBranch = localStorage.getItem('selectedBranch');
        
        // Logic quyết định khi nào mở Modal
        if (forceOpen) {
            // Trường hợp 1: Người dùng bấm nút "Đổi chi nhánh" -> Luôn mở
            setShowModal(true);
            fetchBranches();
        } else if (!savedBranch) {
            // Trường hợp 2: Lần đầu truy cập (chưa có trong LocalStorage) -> Mở để bắt buộc chọn
            setShowModal(true);
            fetchBranches();
        } else {
            // Trường hợp 3: Đã chọn rồi -> Chỉ cập nhật lại State cho App cha
             if (onBranchSelected) onBranchSelected(JSON.parse(savedBranch));
        }
    }, [forceOpen]);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            // SỬA DÒNG NÀY: Thêm ?active=true
            const { data } = await axios.get(`${API_URL}/api/branches?active=true`);
            setBranches(data);
        } catch (err) {
            setError('Không thể tải danh sách chi nhánh. Vui lòng kiểm tra kết nối.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBranch = (branch) => {
        // 1. Lưu vào Storage
        localStorage.setItem('selectedBranch', JSON.stringify(branch));
        
        // 2. Truyền ngược lên App
        if (onBranchSelected) onBranchSelected(branch);
        
        // 3. Đóng Modal
        setShowModal(false);
        
        // (Tùy chọn) Reload trang nếu muốn reset giỏ hàng/sản phẩm triệt để
        // window.location.reload(); 
    };

    // Logic tìm chi nhánh gần nhất (Dựa trên tọa độ)
    const handleFindNearest = () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt không hỗ trợ định vị.');
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const { data } = await axios.get(
                        `${API_URL}/api/branches/nearest?lat=${latitude}&lng=${longitude}`
                    );
                    // Tự động chọn chi nhánh tìm được
                    handleSelectBranch(data);
                } catch (err) {
                    alert('Không tìm thấy chi nhánh nào gần bạn.');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setLoading(false);
                alert('Bạn đã từ chối cấp quyền vị trí.');
            }
        );
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
                
                {/* --- HEADER MODAL: Nhấn mạnh việc Giao Hàng --- */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center relative">
                    <div className="mb-3 flex justify-center">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30 shadow-inner">
                            <span className="text-4xl filter drop-shadow-md">🛵</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold tracking-wide uppercase">Chọn Nơi Giao Hàng</h2>
                    <p className="text-indigo-100 mt-2 text-sm font-medium">
                        Chọn chi nhánh gần bạn nhất để món ăn luôn nóng hổi!
                    </p>
                </div>

                {/* --- BODY MODAL --- */}
                <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
                    
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-medium border border-red-200">{error}</div>}
                    
                    {loading && branches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mb-3"></div>
                            <span className="text-gray-500 text-sm font-medium">Đang tải danh sách chi nhánh...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Nút Tìm vị trí tự động */}
                            <button 
                                onClick={handleFindNearest}
                                className="w-full bg-white border-2 border-dashed border-indigo-400 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 flex justify-center items-center transition-all duration-200 group shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Tìm chi nhánh gần tôi nhất
                            </button>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Hoặc chọn từ danh sách</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            {/* Danh sách chi nhánh */}
                            <div className="space-y-3">
                                {branches.map((branch) => (
                                    <div 
                                        key={branch._id}
                                        onClick={() => handleSelectBranch(branch)}
                                        className="group relative bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 text-lg flex items-center">
                                                    {branch.name}
                                                </h3>
                                                <div className="flex items-start text-gray-500 mt-1 text-sm">
                                                    <span className="mr-1.5 mt-0.5 text-indigo-400">📍</span>
                                                    <span className="line-clamp-2">{branch.address}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                                                        <span className="mr-1">⏰</span>
                                                        {branch.operatingHours || '8:00 - 22:00'}
                                                    </div>
                                                    <div className="flex items-center text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                        <span className="mr-1">📞</span>
                                                        {branch.phoneNumber || 'Hotline'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Icon Check khi hover */}
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                                                <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer: Chỉ hiện nút Đóng nếu Modal bị ép mở (tức là đang Đổi chi nhánh) */}
                 {forceOpen && (
                    <div className="p-4 bg-gray-50 border-t text-center">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                        >
                            Hủy bỏ (Giữ nguyên chi nhánh cũ)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchModal;