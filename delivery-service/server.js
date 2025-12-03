import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';
import Drone from './src/models/droneModel.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- CẤU HÌNH DATABASE ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodfast-db');
        console.log('✅ Delivery Service DB Connected');
    } catch (err) {
        console.error('❌ DB Connection Error:', err);
    }
};
connectDB();

// --- CẤU HÌNH SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware để dùng io trong route nếu cần (tùy chọn)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// URL Order Service
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

// Tọa độ giả lập (Trong thực tế bạn sẽ lấy từ DB địa chỉ kho và địa chỉ khách)
const RESTAURANT_LOC = { lat: 10.7769, lng: 106.7009 }; // Điểm xuất phát
const CUSTOMER_LOC = { lat: 10.7626, lng: 106.6602 };   // Điểm đến

// --- XỬ LÝ KẾT NỐI SOCKET ---
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Lắng nghe khi Frontend muốn theo dõi một đơn hàng cụ thể
    socket.on('join_order_room', (orderId) => {
        console.log(`📡 User joined room: ${orderId}`);
        socket.join(orderId);
    });

    socket.on('disconnect', () => {
        // console.log('Client disconnected');
    });
});

// --- ROUTES CRUD DRONE (GIỮ NGUYÊN) ---
app.get('/', async (req, res) => {
    try {
        const { branchId } = req.query;
        const query = branchId ? { branchId } : {};
        const drones = await Drone.find(query);
        res.json(drones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/', async (req, res) => {
    try {
        const drone = await Drone.create(req.body);
        io.emit('drone_update', drone);
        res.status(201).json(drone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const drone = await Drone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit('drone_update', drone);
        res.json(drone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        await Drone.findByIdAndDelete(req.params.id);
        io.emit('drone_deleted', req.params.id);
        res.json({ message: 'Drone removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- [NÂNG CẤP] HÀM MÔ PHỎNG DI CHUYỂN & GIAO HÀNG ---
const simulateDelivery = (drone, orderId) => {
    console.log(`🚁 [SIMULATION] Drone ${drone.name} bắt đầu bay cho đơn ${orderId}...`);

    let progress = 0; // Tiến độ từ 0.0 đến 1.0
    const step = 0.05; // Mỗi lần cập nhật đi được 5% quãng đường (Khoảng 20 bước)

    // Sử dụng setInterval thay vì setTimeout để cập nhật vị trí liên tục
    const flightInterval = setInterval(async () => {
        progress += step;

        // 1. Tính toán tọa độ hiện tại (Nội suy tuyến tính)
        const currentLat = RESTAURANT_LOC.lat + (CUSTOMER_LOC.lat - RESTAURANT_LOC.lat) * progress;
        const currentLng = RESTAURANT_LOC.lng + (CUSTOMER_LOC.lng - RESTAURANT_LOC.lng) * progress;

        // 2. Gửi sự kiện cập nhật vị trí xuống Frontend (qua Room OrderId)
        io.to(orderId).emit('status_update', {
            status: progress < 1 ? 'Đang bay đến chỗ bạn...' : 'Đang hạ cánh...',
            location: { lat: currentLat, lng: currentLng },
            droneId: drone.name
        });

        // console.log(`📍 Drone ${drone.name} at [${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}]`);

        // 3. Kiểm tra xem đã đến nơi chưa
        if (progress >= 1) {
            clearInterval(flightInterval); // Dừng bay
            console.log(`✅ [SIMULATION] Drone ${drone.name} đã đến đích!`);

            // --- XỬ LÝ KHI GIAO XONG (Code cũ của bạn) ---
            try {
                // Cập nhật Order Service -> DELIVERED
                await axios.put(`${ORDER_SERVICE_URL}/${orderId}/status`, {
                    status: 'DELIVERED'
                });
                console.log(`-> Đã cập nhật Order ${orderId} thành DELIVERED`);

                // Gửi thông báo cuối cùng cho Frontend
                io.to(orderId).emit('status_update', {
                    status: 'Đã giao hàng thành công',
                    location: CUSTOMER_LOC,
                    droneId: drone.name
                });

                // Reset Drone về trạng thái Idle
                const currentDrone = await Drone.findById(drone._id);
                if (currentDrone) {
                    currentDrone.status = 'Idle';
                    currentDrone.currentOrderId = null;
                    currentDrone.batteryLevel = Math.max(0, currentDrone.batteryLevel - 10);
                    const updatedDrone = await currentDrone.save();

                    io.emit('drone_update', updatedDrone); // Cập nhật cho Admin Dashboard
                    console.log(`-> Drone ${updatedDrone.name} đã hoàn thành nhiệm vụ và về trạm sạc.`);
                }

            } catch (error) {
                console.error("❌ Lỗi khi kết thúc giao hàng:", error.message);
            }
        }
    }, 2000); // Cứ 2 giây cập nhật 1 lần (Khớp với animation frontend)
};

// --- API BẮT ĐẦU GIAO HÀNG ---
app.post('/start-delivery', async (req, res) => {
    const { orderId, branchId } = req.body;
    console.log(`🚚 [API] Nhận yêu cầu giao hàng. Order: ${orderId}, Branch: ${branchId}`);

    if (!orderId || !branchId) {
        return res.status(400).json({ message: "Thiếu orderId hoặc branchId" });
    }

    try {
        // 1. Tìm Drone rảnh
        const availableDrone = await Drone.findOne({
            branchId: branchId,
            status: 'Idle',
            batteryLevel: { $gt: 20 }
        });

        if (!availableDrone) {
            console.warn(`⚠️ Không tìm thấy drone rảnh tại chi nhánh ${branchId}`);
            return res.status(404).json({ message: "Không có Drone khả dụng (hoặc Pin yếu)" });
        }

        console.log(`✅ Đã tìm thấy Drone: ${availableDrone.name}`);

        // 2. Cập nhật Drone -> Delivering
        availableDrone.status = 'Delivering';
        availableDrone.currentOrderId = orderId;
        const savedDrone = await availableDrone.save();
        io.emit('drone_update', savedDrone);

        // 3. Gọi Order Service cập nhật Order -> SHIPPING
        try {
            const updateUrl = `${ORDER_SERVICE_URL}/${orderId}/status`;
            console.log(`📞 Đang gọi: PUT ${updateUrl}`);

            await axios.put(updateUrl, {
                status: 'SHIPPING',
                droneId: savedDrone.name
            });
            console.log("✅ Order Service đã chuyển trạng thái SHIPPING");
        } catch (e) {
            console.error("❌ Lỗi gọi Order Service:", e.message);
            // Vẫn tiếp tục chạy simulation dù lỗi gọi API Order (để test)
        }

        // 4. Bắt đầu mô phỏng bay (Nâng cấp)
        simulateDelivery(savedDrone, orderId);

        res.json({
            message: "Đã điều phối Drone thành công",
            drone: savedDrone
        });

    } catch (error) {
        console.error("❌ Lỗi Server (start-delivery):", error);
        res.status(500).json({ message: "Lỗi server khi điều phối: " + error.message });
    }
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`🚀 Delivery Service running on port ${PORT}`);
});