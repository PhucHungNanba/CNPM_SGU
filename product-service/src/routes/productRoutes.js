// product-service/src/routes/productRoutes.js

import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
<<<<<<< HEAD
    deleteProduct,
    seedInventory
=======
<<<<<<< HEAD
    deleteProduct,
    seedInventory
=======
    deleteProduct
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
} from '../controllers/productController.js';

const router = express.Router();

// Route cho /
router.route('/')
    .post(protect, admin, createProduct) // Chỉ admin mới được tạo
    .get(getAllProducts);

// Route cho /:id
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct) // Chỉ admin mới được cập nhật
    .delete(protect, admin, deleteProduct); // <-- Đảm bảo dòng này tồn tại
<<<<<<< HEAD
router.route('/seed-inventory').post(seedInventory); // <--- Thêm route này
=======
<<<<<<< HEAD
router.route('/seed-inventory').post(seedInventory); // <--- Thêm route này
=======

>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
export default router;