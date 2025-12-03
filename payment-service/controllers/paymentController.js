import axios from 'axios';

// Đọc URL từ biến môi trường do docker-compose cung cấp
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

export const processPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: 'Cần có ID đơn hàng' });
        }

        // Sử dụng URL từ biến môi trường
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}/pay`);

        console.log(`Payment successful for order ${orderId}`);
        res.status(200).json({ message: 'Thanh toán thành công' });

    } catch (error) {
        console.error("Payment processing error:", error.message);
        res.status(500).json({ message: 'Thanh toán thất bại' });
    }
};