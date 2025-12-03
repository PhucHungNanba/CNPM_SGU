import React, { useContext, useState, useEffect } from 'react'; // Nhớ import useEffect
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
    const { cartItems, removeFromCart, updateCartQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy ghi chú cũ nếu có
    const [orderNote, setOrderNote] = useState(localStorage.getItem('orderNote') || '');

    // --- FIX LỖI: Tự động lưu ghi chú ngay khi gõ ---
    useEffect(() => {
        localStorage.setItem('orderNote', orderNote);
    }, [orderNote]);
    // -----------------------------------------------

    const updateQty = (item, newQty) => {
        let qty = parseInt(newQty);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (item.countInStock && qty > item.countInStock) {
            alert(`Xin lỗi, chỉ còn ${item.countInStock} sản phẩm trong kho.`);
            qty = item.countInStock;
        }
        updateCartQuantity(item.product, qty);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const checkoutHandler = () => {
        // Không cần setItem ở đây nữa vì useEffect đã làm rồi
        navigate('/shipping');
    };

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Giỏ Hàng Của Bạn</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-semibold text-gray-600 mb-4">Giỏ hàng đang trống</h2>
                    <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md">
                        Quay lại thực đơn
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- CỘT TRÁI: DANH SÁCH --- */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase">
                                <div className="col-span-6">Món ăn</div>
                                <div className="col-span-2 text-center">Đơn giá</div>
                                <div className="col-span-3 text-center">Số lượng</div>
                                <div className="col-span-1 text-center">Xóa</div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-6 flex items-center w-full">
                                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} />
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-800 hover:text-indigo-600 line-clamp-1">{item.name}</Link>
                                                {item.selectedOptions?.length > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1">{item.selectedOptions.map(opt => `+ ${opt.name}`).join(', ')}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center font-semibold text-gray-700">{item.price.toLocaleString('vi-VN')} ₫</div>
                                        <div className="col-span-3 flex justify-center">
                                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                <button onClick={() => updateQty(item, item.quantity - 1)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold border-r disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                                <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item, e.target.value)} className="w-16 text-center py-2 focus:outline-none font-semibold text-gray-700" />
                                                <button onClick={() => updateQty(item, item.quantity + 1)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold border-l">+</button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-center mt-2 md:mt-0">
                                            <button onClick={() => removeFromCart(item.product)} className="text-gray-400 hover:text-red-500 p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                            <Link to="/" className="text-indigo-600 font-semibold hover:underline flex items-center text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: TỔNG KẾT --- */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-50 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Thông tin đơn hàng</h2>

                            {/* KHUNG NHẬP GHI CHÚ */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú cho nhà hàng / Shipper:</label>
                                <textarea
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows="3"
                                    placeholder="Ví dụ: Giao hàng giờ hành chính, không cay..."
                                ></textarea>
                            </div>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span className="font-medium">{totalPrice.toLocaleString('vi-VN')} ₫</span></div>
                                <div className="flex justify-between text-gray-600"><span>Phí giao hàng</span><span className="text-green-600 font-bold">Miễn phí</span></div>
                            </div>
                            <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mb-6">
                                <span className="font-bold text-lg text-gray-800">Tổng cộng</span>
                                <span className="font-bold text-2xl text-indigo-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <button onClick={checkoutHandler} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 transition">Tiến hành đặt hàng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}