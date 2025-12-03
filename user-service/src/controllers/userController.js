import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs'; // Không cần import nữa vì đã dùng method trong Model

// Hàm generateToken
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Đăng ký user mới
// @route   POST /register
// @desc    Đăng ký user mới
// @route   POST /register
export const registerUser = async (req, res) => {
    // Thêm branchId và isAdmin vào danh sách nhận
    const { name, email, password, phone, branchId, isAdmin } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            // Lưu branchId và isAdmin nếu có (Mặc định model đã handle null/false)
            branchId: branchId || null,
            isAdmin: isAdmin || false
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            branchId: user.branchId,
            token: generateToken(user._id, user.isAdmin),
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Đăng nhập
// @route   POST /login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        // Dùng method matchPassword đã định nghĩa trong Model
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                phone: user.phone,
                branchId: user.branchId, // <--- QUAN TRỌNG: Trả về branchId để Frontend phân quyền
                token: generateToken(user._id, user.isAdmin),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy thông tin profile (cho user)
// @route   GET /profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật thông tin profile (cho user)
// @route   PUT /profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            if (req.body.password) {
                user.password = req.body.password; // Middleware pre-save sẽ tự hash
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                phone: updatedUser.phone,
                branchId: updatedUser.branchId,
                token: generateToken(updatedUser._id, updatedUser.isAdmin),
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả user (cho Admin)
// @route   GET /
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Xóa user (cho Admin)
// @route   DELETE /:id
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'Người dùng đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};