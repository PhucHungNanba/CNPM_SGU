<<<<<<< HEAD
﻿import axios from 'axios';

// Đọc URL từ biến môi trường do docker-compose cung cấp
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

export const processPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
=======
<<<<<<< HEAD
﻿import axios from 'axios';

// Đọc URL từ biến môi trường do docker-compose cung cấp
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

export const processPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
=======
﻿// payment-service/controllers/paymentController.js
import axios from 'axios';

// @desc    Xử lý thanh toán (giả lập)
// @route   POST /api/payments
export const processPayment = async (req, res) => { // <-- Add async here
    try {
        const { orderId } = req.body;

>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
        if (!orderId) {
            return res.status(400).json({ message: 'Cần có ID đơn hàng' });
        }

<<<<<<< HEAD
        // Sử dụng URL từ biến môi trường
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}/pay`);
=======
<<<<<<< HEAD
        // Sử dụng URL từ biến môi trường
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}/pay`);
=======
        // Gọi ngược lại Order Service để cập nhật trạng thái
        await axios.put(`http://localhost:3003/${orderId}/pay`); // URL corrected previously
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

        console.log(`Payment successful for order ${orderId}`);
        res.status(200).json({ message: 'Thanh toán thành công' });

    } catch (error) {
<<<<<<< HEAD
        console.error("Payment processing error:", error.message);
        res.status(500).json({ message: 'Thanh toán thất bại' });
=======
<<<<<<< HEAD
        console.error("Payment processing error:", error.message);
        res.status(500).json({ message: 'Thanh toán thất bại' });
=======
        console.error("Payment processing error:", error.response?.data?.message || error.message);
        // Forward the error from Order Service if available
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Thanh toán thất bại';
        res.status(status).json({ message: message });
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    }
};