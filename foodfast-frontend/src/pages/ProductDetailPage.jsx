// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        }
    };

    if (loading) return <p className="text-center mt-8">Đang tải...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!product) return <p className="text-center mt-8">Không tìm thấy sản phẩm.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Quay lại trang chủ</Link>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="bg-gray-200 text-gray-800 text-sm font-medium mr-auto px-2.5 py-0.5 rounded">
                        {product.category}
                    </span>
                    <h1 className="text-4xl font-bold my-3">{product.name}</h1>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    <p className="text-4xl font-bold text-indigo-600 my-4">
                        {product.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <button
                        onClick={handleAddToCart}
                        className="w-full max-w-xs py-3 px-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;