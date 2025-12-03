import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

// --- SỬA ĐƯỜNG DẪN IMPORT ---
import connectDB from './src/config/db.js';       // Trỏ vào src/config
import orderRoutes from './src/routes/orderRoutes.js'; // Trỏ vào src/routes

dotenv.config();

// Kết nối Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- KHỞI TẠO SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // Dấu * nghĩa là chấp nhận kết nối từ MỌI NƠI (mọi IP)
        // Rất quan trọng khi test LAN
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('🔌 New client connected to Order Socket:', socket.id);

    socket.on('join_branch', (branchId) => {
        if (branchId) {
            socket.join(branchId);
            console.log(`User ${socket.id} joined branch room: ${branchId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// --- ROUTES ---
app.use('/', orderRoutes);
app.get('/', (req, res) => {
    res.send('API Order Service is running...');
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
});