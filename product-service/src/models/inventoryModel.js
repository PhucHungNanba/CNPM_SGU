import mongoose from 'mongoose'; // Sửa import
// const mongoose = require('mongoose'); // Dòng cũ (nếu có)

const inventorySchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

inventorySchema.index({ product: 1, branchId: 1 }, { unique: true });

// module.exports = mongoose.model('Inventory', inventorySchema); // <-- Dòng cũ (Xóa dòng này)
export default mongoose.model('Inventory', inventorySchema); // <-- Thay bằng dòng này