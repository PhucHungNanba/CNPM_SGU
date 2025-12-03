<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
﻿import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        // --- PHÂN QUYỀN CHI NHÁNH ---
        branchId: {
            type: String,
            default: null,
            // Lưu ý logic: 
            // - Nếu null: Là Super Admin (Xem được tất cả chi nhánh)
            // - Nếu có ID: Là Admin của chi nhánh đó (Chỉ xem được đơn hàng của chi nhánh đó)
        },
        // --- THÔNG TIN BỔ SUNG ---
        phone: {
            type: String,
            required: false, // Nên để false để tránh lỗi khi tạo user cũ chưa có sđt
            default: '',
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Phương thức kiểm tra mật khẩu (BẮT BUỘC PHẢI CÓ cho chức năng đăng nhập)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
=======
﻿// user-service/src/models/userModel.js

// Thay thế require bằng import
import mongoose from 'mongoose';
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        // --- PHÂN QUYỀN CHI NHÁNH ---
        branchId: {
            type: String,
            default: null,
            // Lưu ý logic: 
            // - Nếu null: Là Super Admin (Xem được tất cả chi nhánh)
            // - Nếu có ID: Là Admin của chi nhánh đó (Chỉ xem được đơn hàng của chi nhánh đó)
        },
        // --- THÔNG TIN BỔ SUNG ---
        phone: {
            type: String,
            required: false, // Nên để false để tránh lỗi khi tạo user cũ chưa có sđt
            default: '',
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Phương thức kiểm tra mật khẩu (BẮT BUỘC PHẢI CÓ cho chức năng đăng nhập)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
<<<<<<< HEAD
=======

// Thay thế module.exports bằng export default
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
export default User;