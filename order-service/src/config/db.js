import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Dùng biến môi trường MONGO_URI, nếu không có thì fallback về localhost
        // Lưu ý: Khi chạy Docker, MONGO_URI thường là mongodb://mongo:27017/foodfast-db
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodfast-db');

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Thoát process nếu kết nối thất bại
    }
};

export default connectDB;