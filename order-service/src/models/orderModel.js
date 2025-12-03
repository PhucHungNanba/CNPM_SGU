<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
﻿import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        // --- SỬA LẠI CHO GIỐNG ẢNH ---
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Đổi tên field từ 'user' -> 'userId'
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // Vẫn giữ để hỗ trợ tính năng đa chi nhánh
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                // Lưu option nếu có
                selectedOptions: [
                    { name: String, price: Number }
                ],
                note: String
=======
﻿// order-service/src/models/orderModel.js
import mongoose from 'mongoose';
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

const orderSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        branchId: { type: mongoose.Schema.Types.ObjectId, required: true },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
<<<<<<< HEAD
                product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
                selectedOptions: [{ name: String, price: Number }],
                note: String // Ghi chú riêng cho từng món
=======
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
<<<<<<< HEAD
            phone: { type: String },
            postalCode: { type: String, default: '70000' },
            country: { type: String, default: 'Vietnam' },
=======
<<<<<<< HEAD
            phone: { type: String }, // Thêm sđt
            // Các trường này backend yêu cầu nhưng frontend có thể tự map
            postalCode: { type: String, default: '70000' },
            country: { type: String, default: 'Vietnam' },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'PAID'
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, default: 0.0 },
        taxPrice: { type: Number, default: 0.0 },
        shippingPrice: { type: Number, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: { type: String, default: 'Pending' },

        // --- GIỐNG ẢNH ---
        droneId: { type: String, default: null }
=======
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        },
        paymentMethod: { type: String, required: true, default: 'COD' },

        // --- [QUAN TRỌNG] THÊM TRƯỜNG NOTE VÀO ĐÂY ---
        note: { type: String, default: '' },
        // ----------------------------------------------

        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, default: 0.0 },
        taxPrice: { type: Number, default: 0.0 },
        shippingPrice: { type: Number, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },

        // --- CẬP NHẬT DANH SÁCH TRẠNG THÁI ĐẦY ĐỦ ---
        status: {
            type: String,
            enum: [
                'Pending',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled', // <-- Cái cũ (viết thường)

                // --- THÊM CÁI NÀY VÀO ---
                'CANCELLED', // <-- Cái mới (viết hoa) để khớp với Frontend
                // ------------------------

                'PENDING_PAYMENT',
                'PAID_WAITING_PROCESS',
                'PREPARING',
                'READY_TO_SHIP',
                'SHIPPING',
                'DELIVERED',
                'PROCESSING_REQUEST'
            ],
            default: 'PENDING_PAYMENT'
        },
<<<<<<< HEAD

        droneId: { type: String, default: null }
=======
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
<<<<<<< HEAD

=======
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
export default Order;