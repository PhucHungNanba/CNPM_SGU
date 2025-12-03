import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
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