import jwt from 'jsonwebtoken';

// Middleware bảo vệ route
export const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Gắn thông tin (id, isAdmin) vào request
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token không hợp lệ' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, không có token' });
    }
};

// Middleware kiểm tra quyền Admin
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền admin' });
    }
};