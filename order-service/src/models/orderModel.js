import mongoose from 'mongoose';

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
                product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
                selectedOptions: [{ name: String, price: Number }],
                note: String // Ghi chú riêng cho từng món
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: String },
            postalCode: { type: String, default: '70000' },
            country: { type: String, default: 'Vietnam' },
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

        droneId: { type: String, default: null }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;