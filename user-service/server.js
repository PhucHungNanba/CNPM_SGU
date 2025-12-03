import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB for User Service'))
    .catch((err) => console.error('❌ Could not connect to MongoDB:', err));

// Routes
app.use('/', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 User Service is running on http://localhost:${PORT}`);
});