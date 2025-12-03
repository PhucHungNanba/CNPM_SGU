import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
<<<<<<< HEAD
    name: { type: String, required: true }, // Ví dụ: Drone-Alpha-01
    model: { type: String, default: 'DJI Delivery X1' },
    status: {
        type: String,
        enum: ['Idle', 'Delivering', 'Returning', 'Maintenance', 'Charging'],
        default: 'Idle'
    },
    batteryLevel: { type: Number, default: 100 },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    branchId: { type: String, required: true }, // Drone thuộc chi nhánh nào
    currentOrderId: { type: String, default: null } // Đang giao đơn nào
}, { timestamps: true });

export default mongoose.model('Drone', droneSchema);
=======
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        // 'available': rảnh, 'busy': đang giao, 'maintenance': đang bảo trì
        enum: ['available', 'busy', 'maintenance'],
        default: 'available',
    },
    currentOrderId: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const Drone = mongoose.model('Drone', droneSchema);
export default Drone;
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
