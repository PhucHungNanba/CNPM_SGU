const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
    console.log(`[Gateway] Received request: ${req.method} ${req.originalUrl}`);
    next();
});

const services = [
    {
        route: '/api/users',
        target: 'http://user-service:3001',
    },
    {
        route: '/api/products',
        target: 'http://product-service:3002',
    },
    {
        route: '/api/orders',
        target: 'http://order-service:3003',
    },
    {
        route: '/api/payments',
        target: 'http://payment-service:3004',
    },
    {
        route: '/api/drones',
        target: 'http://delivery-service:3005',
    },
    // --- THÊM BRANCH SERVICE VÀO ĐÂY ---
    {
        route: '/api/branches',
        // Nếu chạy docker thì dùng 'http://branch-service:3006'
        // Nếu chạy node thường trên máy thì dùng 'http://localhost:3006'
        target: process.env.BRANCH_SERVICE_URL || 'http://branch-service:3006',
    },
];

services.forEach(({ route, target }) => {
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            // Dòng này sẽ cắt bỏ tiền tố route.
            // Ví dụ: Client gọi /api/branches/nearest -> Service nhận /nearest
            [`^${route}`]: '',
        },
    };
    app.use(route, createProxyMiddleware(proxyOptions));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});