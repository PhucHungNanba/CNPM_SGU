import Order from '../models/orderModel.js';
import axios from 'axios';

// Nếu chạy Docker thì dùng tên service, nếu chạy local thì dùng localhost
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// @desc    Tạo đơn hàng mới
// @route   POST /
export const createOrder = async (req, res) => {
    try {
        const { userId, orderItems, shippingAddress, branchId, paymentMethod, note } = req.body;

        console.log("---------------------------------------");
        console.log("📝 SERVER NHẬN ĐƠN HÀNG MỚI:");
        console.log("-> Ghi chú:", note);
        console.log("---------------------------------------");

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
            userId: userId,
            branchId: branchId,
            orderItems: itemsToSave,
            shippingAddress: {
                ...shippingAddress,
                country: 'Vietnam',
                postalCode: '70000'
            },
            paymentMethod: paymentMethod || 'COD',
            totalPrice: calculatedTotalPrice,
            note: note || ''
        });

        const createdOrder = await order.save();

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

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("❌ Lỗi updateOrderStatus:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Gán Drone giao hàng
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
    }
};