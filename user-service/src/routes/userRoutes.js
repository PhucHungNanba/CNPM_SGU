import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
} from '../controllers/userController.js'; // <-- Đường dẫn tương đối
import { protect, admin } from '../middleware/authMiddleware.js'; // <-- Đường dẫn tương đối

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User profile route (chỉ user đã đăng nhập)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes (chỉ admin)
router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:id')
    .delete(protect, admin, deleteUser);

export default router;