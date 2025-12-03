const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Cho phép mọi nguồn (CORS) vì Gateway sẽ gọi vào đây
app.use(cors());
app.use(express.json());

// --- KẾT NỐI DATABASE ---
// Đảm bảo bạn đã có biến MONGO_URI trong file .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Branch Service connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- 1. ĐỊNH NGHĨA MODEL (Branch) ---
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    phoneNumber: String,
    operatingHours: { type: String, default: '8:00 - 22:00' },

    // --- THÊM TRƯỜNG NÀY ---
    isActive: {
        type: Boolean,
        default: true, // Mặc định là đang hoạt động
    }
}, { timestamps: true });

branchSchema.index({ location: '2dsphere' });

const Branch = mongoose.model('Branch', branchSchema);

// --- 2. CONTROLLERS ---

// Tạo chi nhánh mới
const createBranch = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ body
        const { name, address, lat, lng, phoneNumber, operatingHours } = req.body;

        // 2. Validate toạ độ (BẮT BUỘC PHẢI CÓ SỐ)
        // Nếu lat hoặc lng bị rỗng, null hoặc không phải số hợp lệ -> Báo lỗi ngay
        if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            return res.status(400).json({
                message: 'Vui lòng nhập Vĩ độ (Lat) và Kinh độ (Lng) hợp lệ.'
            });
        }

        // 3. Tạo object Location chuẩn GeoJSON
        const location = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // Lưu ý: MongoDB chuẩn là [Lng, Lat]
        };

        // 4. Tạo chi nhánh mới
        const newBranch = new Branch({
            name,
            address,
            location,
            phoneNumber,
            operatingHours,
            isActive: true // Mặc định mở cửa
        });

        await newBranch.save();
        res.status(201).json(newBranch);

    } catch (error) {
        console.error("Lỗi tạo chi nhánh:", error);
        res.status(400).json({
            message: 'Không thể tạo chi nhánh',
            error: error.message
        });
    }
};

// Lấy tất cả chi nhánh
const getAllBranches = async (req, res) => {
    try {
        // 1. Lấy tham số 'active' từ URL (VD: /api/branches?active=true)
        const { active } = req.query;

        let query = {};

        // 2. Nếu có tham số active=true, chỉ lấy chi nhánh đang mở
        if (active === 'true') {
            query.isActive = true;
        }

        // 3. Tìm kiếm với điều kiện lọc (nếu có)
        const branches = await Branch.find(query);

        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chi nhánh', error: error.message });
    }
};
const getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            res.json(branch);
        } else {
            res.status(404).json({ message: 'Không tìm thấy chi nhánh' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
// Tìm chi nhánh gần nhất
// URL gọi từ Gateway: GET /api/branches/nearest?lat=...&lng=...
const findNearestBranch = async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tham số lat và lng.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    try {
        const nearestBranch = await Branch.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude] // Lưu ý: MongoDB dùng [Lng, Lat]
                    },
                    // $maxDistance: 20000 // (Tùy chọn) Tìm trong bán kính 20km
                }
            }
        });

        if (!nearestBranch) {
            return res.status(404).json({ message: 'Không tìm thấy chi nhánh nào gần bạn.' });
        }

        res.status(200).json(nearestBranch);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm chi nhánh gần nhất', error: error.message });
    }
};

const updateBranch = async (req, res) => {
    try {
        // 1. Thêm isActive vào danh sách biến lấy từ req.body
        const { name, address, lat, lng, phoneNumber, operatingHours, isActive } = req.body;

        const branch = await Branch.findById(req.params.id);

        if (branch) {
            branch.name = name || branch.name;
            branch.address = address || branch.address;
            branch.phoneNumber = phoneNumber || branch.phoneNumber;
            branch.operatingHours = operatingHours || branch.operatingHours;

            // --- [ĐOẠN CODE CẦN THÊM VÀO] ---
            // Kiểm tra xem isActive có được gửi lên không (vì nó là boolean true/false)
            if (isActive !== undefined) {
                branch.isActive = isActive;
            }
            // -------------------------------

            // Cập nhật tọa độ nếu có
            if (lat && lng) {
                branch.location = {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)] // Mongo: [Lng, Lat]
                };
            }

            const updatedBranch = await branch.save();
            res.json(updatedBranch);
        } else {
            res.status(404).json({ message: 'Không tìm thấy chi nhánh' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
    }
};

// Xóa chi nhánh
const deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            await branch.deleteOne();
            res.json({ message: 'Chi nhánh đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy chi nhánh' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa chi nhánh', error: error.message });
    }
};

// --- 3. ROUTES (Cập nhật lại) ---
app.post('/', createBranch);
app.get('/', getAllBranches);
app.get('/nearest', findNearestBranch);
// Thêm 2 route mới:
app.put('/:id', updateBranch);    // Gọi qua Gateway: PUT /api/branches/:id
app.delete('/:id', deleteBranch); // Gọi qua Gateway: DELETE /api/branches/:id
app.get('/:id', getBranchById); // API: GET /api/branches/:id
// --- 3. ROUTES ---
// Lưu ý: Gateway đã cắt bỏ prefix '/api/branches', nên ở đây ta dùng route gốc

app.post('/', createBranch);      // Khớp với Gateway POST /api/branches
app.get('/', getAllBranches);     // Khớp với Gateway GET /api/branches
app.get('/nearest', findNearestBranch); // Khớp với Gateway GET /api/branches/nearest
app.put('/:id', updateBranch);    // Gọi qua Gateway: PUT /api/branches/:id
app.delete('/:id', deleteBranch); // Gọi qua Gateway: DELETE /api/branches/:id
// --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`🚀 Branch Service running on port ${PORT}`);
});