import express from 'express';
import {
    createOrder,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getAllOrders,
    assignDrone
} from '../controllers/orderController.js';

const router = express.Router();

// Định nghĩa các route con (Gateway gửi gì thì vào đây)
<<<<<<< HEAD

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
=======

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
=======
    getMyOrders,
    updateOrderToPaid,
    getOrderById,
    updateOrderStatus,
    getAllOrders // Make sure getAllOrders is imported
} from '../controllers/orderController.js';

// Import protect and admin ONCE
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new order (Protected for logged-in users)
router.route('/').post(protect, createOrder);

// Route to get all orders for the logged-in user (Protected)
router.route('/myorders/:userId').get(protect, getMyOrders);

// Route to get all orders (Admin only)
router.route('/all').get(protect, admin, getAllOrders);

// Route to get a specific order by ID (Protected)
router.route('/:id').get(protect, getOrderById);

// Route to update order to paid (Called by Payment Service - check if protect needed)
router.route('/:id/pay').put(updateOrderToPaid);

// Route to update order status (Called by Delivery Service - check if protect needed)
router.route('/:id/status').put(updateOrderStatus);
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

export default router;