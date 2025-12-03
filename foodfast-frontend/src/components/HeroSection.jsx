// src/components/HeroSection.jsx
import React from 'react';

const HeroSection = () => {
    return (
        <div className="relative bg-white text-gray-800 py-16 px-4 md:px-8 overflow-hidden">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                {/* Left Section: Text Content */}
                <div className="md:w-1/2 lg:w-2/5 text-center md:text-left order-2 md:order-1">
                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Lời Mời</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-orange-700 leading-tight mb-6">
                        FoodFast Delivery
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Khám phá các món ăn truyền thống và hiện đại, cùng với các loại đồ uống tinh tế.
                        Mỗi món ăn là một câu chuyện, một trải nghiệm ẩm thực độc đáo.
                    </p>
                    
                </div>

                {/* Right Section: Images (overlapping, artistic style) */}
                <div className="md:w-1/2 lg:w-3/5 relative order-1 md:order-2 flex justify-center items-center">
                    {/* Main image - nhà hàng */}
                    <img
                        src="https://th.bing.com/th/id/R.c6616b136a2911a2483682418315afb4?rik=G3kyaL7fsDbOmA&pid=ImgRaw&r=0" // Thay bằng link ảnh của bạn
                        alt="FoodFast Delivery"
                        className="w-full md:w-4/5 lg:w-3/4 rounded-lg shadow-xl"
                    />
                    {/* Overlapping image - người phụ nữ uống trà */}
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/001/860/102/non_2x/fast-delivery-smartphone-online-food-order-service-free-vector.jpg" // Thay bằng link ảnh của bạn
                        alt="Woman drinking tea"
                        className="absolute -bottom-8 -right-8 w-1/2 md:w-2/5 lg:w-1/3 rounded-lg shadow-2xl border-4 border-white transform rotate-3"
                        style={{ minWidth: '150px' }} // Đảm bảo ảnh không quá nhỏ trên màn hình nhỏ
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;