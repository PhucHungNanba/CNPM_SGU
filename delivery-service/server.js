<<<<<<< HEAD
﻿import express from 'express';
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
=======
<<<<<<< HEAD
﻿import express from 'express';
=======
import express from 'express';
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
<<<<<<< HEAD
import mongoose from 'mongoose';
import Drone from './src/models/droneModel.js';
=======
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Đọc URL từ biến môi trường (do docker-compose.yml cung cấp)
// Nếu không tìm thấy, nó sẽ dùng 'http://order-service:3003' làm mặc định
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

// Kết nối Mongoose (dùng biến môi trường)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for Delivery Service'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));


const server = http.createServer(app);

// Cấu hình Socket.IO với CORS
const io = new Server(server, {
    cors: {
        // ❌ Dòng cũ gây lỗi:
        // origin: "http://localhost:5173",

        // ✅ Dòng mới (Cho phép mọi IP truy cập):
        origin: "*",
=======
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cho ph�p frontend k?t n?i
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
        methods: ["GET", "POST"]
    }
});

<<<<<<< HEAD
// API Endpoint để bắt đầu quá trình giao hàng giả lập
app.post('/start-delivery', async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).send({ message: 'Thiếu orderId' });
    }

    let assignedDrone;
    try {
        assignedDrone = await Drone.findOneAndUpdate(
            { status: 'available' }, // Tìm drone rảnh
            { status: 'busy', currentOrderId: orderId }, // Cập nhật nó thành bận
            { new: true }
        );
        if (!assignedDrone) {
            console.warn("⚠️ Không tìm thấy drone nào rảnh!");
            return res.status(503).send({ message: 'Tất cả drone đều đang bận.' });
        }
    } catch (err) {
        console.error("❌ Lỗi server khi tìm drone:", err.message);
        return res.status(500).send({ message: 'Lỗi server khi tìm drone.' });
    }

    console.log(`🤖 Bắt đầu giao hàng cho đơn ${orderId} bằng drone ${assignedDrone.name}`);
    res.status(200).send({ message: 'Đã bắt đầu quá trình giao hàng.' });

    // Tọa độ giả lập
=======
// API Endpoint ?? b?t ??u qu� tr�nh giao h�ng gi? l?p
app.post('/start-delivery', (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        return res.status(400).send({ message: 'Thi?u orderId' });
    }

    console.log(`B?t ??u gi? l?p giao h�ng cho ??n: ${orderId}`);

    // B�o l?i cho client HTTP r?ng ?� nh?n y�u c?u
    res.status(200).send({ message: '?� b?t ??u qu� tr�nh giao h�ng.' });

    // --- B?T ??U GI? L?P GIAO H�NG ---
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
    const restaurantLocation = { lat: 10.7769, lng: 106.7009 };
    const midPoint = { lat: 10.770, lng: 106.685 };
    const customerLocation = { lat: 10.7626, lng: 106.6602 };

<<<<<<< HEAD
    // Gán Tên drone (dùng biến môi trường ORDER_SERVICE_URL)
    try {
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}/assign-drone`, {
            droneId: assignedDrone.name
        });
        console.log(`✅ Đã gán ${assignedDrone.name} cho đơn hàng ${orderId}`);
    } catch (err) {
        console.error("❌ Lỗi khi gán mã drone:", err.message);
    }

    // Gửi WebSocket (Giai đoạn 1)
    io.to(orderId).emit('status_update', {
        status: 'Đang chuẩn bị hàng',
        location: restaurantLocation,
        droneId: assignedDrone.name
    });

    // Giai đoạn 2
    setTimeout(() => {
        io.to(orderId).emit('status_update', {
            status: 'Đang giao hàng',
            location: midPoint,
            droneId: assignedDrone.name
        });
    }, 5000);

    // Giai đoạn 3
    setTimeout(async () => {
        io.to(orderId).emit('status_update', {
            status: 'Đã giao hàng',
            location: customerLocation,
            droneId: assignedDrone.name
        });

        // Cập nhật trạng thái (dùng biến môi trường ORDER_SERVICE_URL)
        try {
            await axios.put(`${ORDER_SERVICE_URL}/${orderId}/status`, { status: 'Delivered' });
            await Drone.findByIdAndUpdate(assignedDrone._id, {
                status: 'available',
                currentOrderId: null
            });
            console.log(`✅ Đơn hàng ${orderId} hoàn tất, Drone ${assignedDrone.name} đã rảnh.`);
        } catch (err) {
            console.error("❌ Lỗi khi hoàn thành giao hàng:", err.message);
=======
    // G?i tr?ng th�i ??u ti�n
    io.to(orderId).emit('status_update', { status: '?ang chu?n b? h�ng', location: restaurantLocation });

    // Sau 5 gi�y: B?t ??u giao
    setTimeout(() => {
        io.to(orderId).emit('status_update', { status: '?ang giao h�ng', location: midPoint });
    }, 5000);

    // Sau 10 gi�y: Giao th�nh c�ng
    setTimeout(async () => {
        io.to(orderId).emit('status_update', { status: '?� giao h�ng', location: customerLocation });

        // G?i l?i Order Service ?? c?p nh?t tr?ng th�i cu?i c�ng trong DB
        try {
            await axios.put(`${process.env.ORDER_SERVICE_URL}/${orderId}/status`, { status: 'Delivered' });
            console.log(`?� c?p nh?t tr?ng th�i Delivered cho ??n h�ng ${orderId}`);
        } catch (err) {
            console.error("L?i khi g?i l?i Order Service:", err.message);
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
        }
    }, 10000);
});

<<<<<<< HEAD
// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
    console.log('🔌 Một client đã kết nối WebSocket:', socket.id);
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Client ${socket.id} đang theo dõi đơn hàng ${orderId}`);
    });
    socket.on('disconnect', () => console.log('🔌 Một client đã ngắt kết nối WebSocket'));
});

// Khởi động server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`🚀 Delivery Service đang chạy trên port ${PORT}`);
});
=======
io.on('connection', (socket) => {
    console.log('M?t client ?� k?t n?i:', socket.id);
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Client ${socket.id} ?� tham gia ph�ng c?a ??n h�ng ${orderId}`);
    });
    socket.on('disconnect', () => console.log('M?t client ?� ng?t k?t n?i'));
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`?? Delivery Service ?ang ch?y tr�n port ${PORT}`));
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
