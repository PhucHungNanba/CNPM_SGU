import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // HÀM 1: Dùng cho nút "Thêm vào giỏ" ở trang Chi tiết/Menu (Cộng dồn số lượng)
    const addToCart = (newItem, quantity = 1) => {
        setCartItems((prevItems) => {
            // Kiểm tra xem món này (theo ID product) đã có chưa
            const existItem = prevItems.find((item) => item.product === newItem.product);

            if (existItem) {
                return prevItems.map((item) =>
                    item.product === newItem.product
                        ? { ...item, quantity: item.quantity + quantity } // Cộng dồn
                        : item
                );
            } else {
                return [...prevItems, { ...newItem, quantity: quantity }];
            }
        });
    };

    // HÀM 2: Dùng riêng cho trang Giỏ Hàng (Ghi đè số lượng chính xác)
    // Khắc phục lỗi: Bấm giảm mà lại tăng
    const updateCartQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.product === productId
                    ? { ...item, quantity: newQuantity } // Ghi đè bằng số mới
                    : item
            );
        });
    };

    // HÀM 3: Xóa sản phẩm (Sửa lại so sánh theo 'product')
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            return prevItems.filter((item) => item.product !== productId);
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};