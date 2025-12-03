import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`}>
            {/* Thẻ Card (nền xám tối) */}
            <div className="border border-gray-700 rounded-lg shadow-lg overflow-hidden bg-gray-800 h-full flex flex-col">

                <img
                    // Dòng này sẽ sửa lỗi ảnh vỡ (hiển thị ảnh dự phòng)
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-48 object-cover" // Cố định chiều cao ảnh
                    loading="lazy"
                />

                {/* Nội dung text (tên, mô tả, giá) */}
                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold truncate mb-1 text-white" title={product.name}>
                        {product.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1 line-clamp-2 flex-grow">
                        {product.description}
                    </p>

                    <p className="text-xl font-semibold mt-auto pt-2 text-yellow-400">
                        {product.price ? product.price.toLocaleString('vi-VN') : 'N/A'} VNĐ
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default Product;