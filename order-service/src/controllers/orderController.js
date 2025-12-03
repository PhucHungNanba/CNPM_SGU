<<<<<<< HEAD
﻿import Order from '../models/orderModel.js';
import axios from 'axios';

<<<<<<< HEAD
// Nếu chạy Docker thì dùng tên service, nếu chạy local thì dùng localhost
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
=======
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
=======
﻿// order-service/src/controllers/orderController.js

import Order from '../models/orderModel.js';
import axios from 'axios';
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

// @desc    Tạo đơn hàng mới
// @route   POST /
export const createOrder = async (req, res) => {
    try {
<<<<<<< HEAD
        const { userId, orderItems, shippingAddress, branchId, paymentMethod, note } = req.body;

        console.log("---------------------------------------");
        console.log("📝 SERVER NHẬN ĐƠN HÀNG MỚI:");
        console.log("-> Ghi chú:", note);
        console.log("---------------------------------------");
=======
<<<<<<< HEAD
        const { userId, orderItems, shippingAddress, branchId, paymentMethod } = req.body;

        // 1. Validate dữ liệu đầu vào
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào' });
        }
        if (!branchId) {
            return res.status(400).json({ message: 'Thiếu thông tin chi nhánh (branchId)' });
        }

        let calculatedTotalPrice = 0;
        const itemsToSave = [];

        // 2. Lặp qua từng sản phẩm để lấy thông tin chính xác từ Product Service
        for (const item of orderItems) {
            try {
                const { data: productFromDB } = await axios.get(
                    `${PRODUCT_SERVICE_URL}/${item.productId}`
                );

                if (!productFromDB) continue;

                let finalItemPrice = productFromDB.price;
                const optionsToSave = [];

                // Tính giá option (topping)
                if (item.selectedOptions && item.selectedOptions.length > 0) {
                    for (const opt of item.selectedOptions) {
                        const optionFromDB = productFromDB.options?.find(dbOpt => dbOpt.name === opt.name);
                        if (optionFromDB) {
                            finalItemPrice += optionFromDB.price;
                            optionsToSave.push(optionFromDB);
                        }
                    }
                }

                calculatedTotalPrice += finalItemPrice * item.quantity;

                // Map dữ liệu vào cấu trúc Schema
                itemsToSave.push({
                    product: item.productId,
                    name: productFromDB.name,
                    image: productFromDB.imageUrl,
                    qty: item.quantity,
                    price: finalItemPrice,
                    selectedOptions: optionsToSave,
                    note: item.note
                });
            } catch (err) {
                console.error(`Lỗi lấy sản phẩm ${item.productId}:`, err.message);
                return res.status(400).json({ message: "Lỗi khi lấy thông tin sản phẩm từ kho" });
            }
        }

        // 3. Tạo đơn hàng
        const order = new Order({
            userId: userId, // Lưu userId
            branchId: branchId,
            orderItems: itemsToSave,
            shippingAddress: {
                ...shippingAddress,
                country: 'Vietnam', // Giá trị mặc định
                postalCode: '70000'
            },
            paymentMethod: paymentMethod || 'COD',
=======
        const { userId, orderItems, shippingAddress } = req.body;
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Không có sản phẩm nào' });
        }
        if (!branchId) {
            return res.status(400).json({ message: 'Thiếu thông tin chi nhánh (branchId)' });
        }

        let calculatedTotalPrice = 0;
        const itemsToSave = [];

        for (const item of orderItems) {
            try {
                const { data: productFromDB } = await axios.get(
                    `${PRODUCT_SERVICE_URL}/${item.productId || item.product}`
                );

                if (!productFromDB) continue;

                let finalItemPrice = productFromDB.price;
                const optionsToSave = [];

                if (item.selectedOptions && item.selectedOptions.length > 0) {
                    for (const opt of item.selectedOptions) {
                        const optionFromDB = productFromDB.options?.find(dbOpt => dbOpt.name === opt.name);
                        if (optionFromDB) {
                            finalItemPrice += optionFromDB.price;
                            optionsToSave.push(optionFromDB);
                        }
                    }
                }

                calculatedTotalPrice += finalItemPrice * item.quantity;

                itemsToSave.push({
                    product: item.productId || item.product,
                    name: productFromDB.name,
                    image: productFromDB.imageUrl,
                    qty: item.quantity,
                    price: finalItemPrice,
                    selectedOptions: optionsToSave,
                    note: item.note
                });
            } catch (err) {
                console.error(`Lỗi lấy sản phẩm ${item.productId}:`, err.message);
                return res.status(400).json({ message: "Lỗi kết nối kho sản phẩm (Product Service)" });
            }
        }

        const order = new Order({
<<<<<<< HEAD
            userId: userId,
            branchId: branchId,
            orderItems: itemsToSave,
            shippingAddress: {
                ...shippingAddress,
                country: 'Vietnam',
                postalCode: '70000'
            },
            paymentMethod: paymentMethod || 'COD',
=======
            userId,
            orderItems: itemsWithPrice,
            shippingAddress,
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
            totalPrice: calculatedTotalPrice,
            note: note || ''
        });

        const createdOrder = await order.save();
<<<<<<< HEAD

        if (req.io) {
            req.io.to(branchId).emit('new_order', createdOrder);
            req.io.emit('admin_data_update');
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn', error: error.message });
    }
};

// @desc    Lấy đơn hàng của user
=======
<<<<<<< HEAD

        // 4. Gửi Socket notification
        if (req.io) {
            // Gửi cho Bếp của chi nhánh cụ thể
            req.io.to(branchId).emit('new_order', createdOrder);
            // Gửi cho Super Admin
            req.io.emit('admin_data_update');
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn', error: error.message });
    }
};

// @desc    Lấy danh sách đơn hàng của User
// @route   GET /myorders/:userId
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy chi tiết 1 đơn hàng
// @route   GET /:id
export const getOrderById = async (req, res) => {
    try {
        // --- SỬA LỖI QUAN TRỌNG ---
        // Tuyệt đối KHÔNG dùng .populate('userId') ở đây vì Order Service không có Model User.
        const order = await Order.findById(req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        console.error("Get Order Detail Error:", error);
=======
        res.status(201).json(createdOrder);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Một trong các sản phẩm không được tìm thấy.' });
        }
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

<<<<<<< HEAD
// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /all
export const getAllOrders = async (req, res) => {
    try {
        const { branchId } = req.query;
        let query = {};

        // Lọc theo chi nhánh nếu có
        if (branchId) {
            query.branchId = branchId;
        }

        // Không dùng populate để tránh lỗi crash
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật thanh toán
=======
// @desc    Lấy các đơn hàng của một người dùng
// @route   GET /myorders/:userId
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

<<<<<<< HEAD
// @desc    Lấy chi tiết 1 đơn hàng
=======
// @desc    Cập nhật trạng thái đơn hàng thành đã thanh toán (gọi từ Payment Service)
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
// @route   PUT /:id/pay
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Processing';
            const updatedOrder = await order.save();

<<<<<<< HEAD
            // Gọi Delivery Service (Async - không chờ kết quả để tránh block UI)
            axios.post('http://delivery-service:3005/start-delivery', {
                orderId: req.params.id,
                branchId: order.branchId
            }).catch(err => console.error("Delivery call failed:", err.message));

            if (req.io) {
                req.io.emit('admin_data_update');
                // Bắn update vào room chi nhánh
                if (order.branchId) req.io.to(order.branchId.toString()).emit('order_update', updatedOrder);
            }
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cập nhật trạng thái đơn hàng
=======
            // Gọi Delivery Service để bắt đầu giao hàng
            try {
                await axios.post('http://localhost:3004/start-delivery', { orderId: req.params.id });
            } catch (err) {
                console.error("Không thể gọi Delivery Service:", err.message);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy một đơn hàng theo ID
// @route   GET /:id
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        console.error("Get Order Detail Error:", error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Admin lấy tất cả
export const getAllOrders = async (req, res) => {
    try {
        const { branchId } = req.query;
        let query = {};
        if (branchId) {
            query.branchId = branchId;
        }
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

<<<<<<< HEAD
// @desc    Cập nhật thanh toán
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'PAID_WAITING_PROCESS';

            const updatedOrder = await order.save();

            if (req.io) {
                req.io.emit('admin_data_update');
                if (order.branchId) req.io.to(order.branchId.toString()).emit('order_update', updatedOrder);
                req.io.to(req.params.id).emit('order_update', updatedOrder);
            }
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Update Paid Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng (Đã xử lý HỦY ĐƠN)
// @route   PUT /:id/status
export const updateOrderStatus = async (req, res) => {
    const { status, droneId } = req.body;

    console.log(`📦 [OrderService] Update Status: ID=${req.params.id} -> ${status}`);

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // 1. Cập nhật trạng thái
            if (status) {
                order.status = status;
            }

            // 2. Cập nhật Drone ID
            if (droneId !== undefined) {
                order.droneId = droneId;
            }

            // --- LOGIC BỔ SUNG KHI HỦY ĐƠN ---
            if (status === 'CANCELLED' || status === 'Cancelled') {
                console.log(`⚠️ Đơn hàng ${order._id} đã bị HỦY bởi Admin/Chi nhánh.`);
                // Nếu cần: order.droneId = null; (Gỡ Drone nếu có)
            }
            // ---------------------------------

            const updatedOrder = await order.save();

            // 3. Bắn Socket báo cho các bên
            if (req.io) {
                // Báo cho Khách hàng
                req.io.to(req.params.id).emit('status_update', {
                    status: updatedOrder.status,
                    droneId: updatedOrder.droneId
                });

                // Báo cho Admin Dashboard (để Admin thấy ngay trên danh sách)
                req.io.emit('admin_data_update');

                // Báo cho Chi nhánh cụ thể
                if (order.branchId) {
                    req.io.to(order.branchId.toString()).emit('order_update', updatedOrder);
                }
            }

=======
// @desc    Cập nhật trạng thái giao hàng (gọi từ Delivery Service)
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
// @route   PUT /:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

<<<<<<< HEAD
            if (req.io) {
                // Báo cho khách hàng (room theo orderId)
                req.io.to(req.params.id).emit('status_update', { status: updatedOrder.status });

                req.io.emit('admin_data_update');
                // Báo cho bếp chi nhánh
                if (order.branchId) req.io.to(order.branchId.toString()).emit('order_update', updatedOrder);
            }
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
<<<<<<< HEAD
        console.error("❌ Lỗi updateOrderStatus:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
=======
        res.status(500).json({ message: 'Server Error' });
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    }
};

// @desc    Gán Drone giao hàng
<<<<<<< HEAD
=======
// @route   PUT /:id/assign-drone
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
export const assignDrone = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.droneId = req.body.droneId;
            const updatedOrder = await order.save();

            if (req.io) {
                req.io.emit('admin_data_update');
                req.io.to(req.params.id).emit('status_update', { droneId: updatedOrder.droneId });
            }
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
<<<<<<< HEAD
=======
=======
            // Gửi thông báo đến client (nếu có)
            if (req.io) {
                req.io.to(req.params.id).emit('status_update', {
                    status: updatedOrder.status
                });
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /all
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}); // Find all orders
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tất cả đơn hàng' });
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
    }
};