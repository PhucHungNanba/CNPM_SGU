import express from 'express';
import {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getAllOrders,
    assignDrone
} from '../controllers/orderController.js';

const router = express.Router();

// Định nghĩa các route con (Gateway gửi gì thì vào đây)

// Route gốc: / (Tương ứng với /api/orders từ Gateway)
router.route('/').post(createOrder);

// Route lấy tất cả đơn (cho Admin): /all
router.route('/all').get(getAllOrders);

// Route lấy đơn của tôi: /myorders/:userId
router.route('/myorders/:userId').get(getMyOrders);

// Các route thao tác trên ID đơn hàng cụ thể
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/status').put(updateOrderStatus);
router.route('/:id/assign-drone').put(assignDrone);

export default router;