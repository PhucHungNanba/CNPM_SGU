<<<<<<< HEAD
﻿import express from 'express';
=======
<<<<<<< HEAD
﻿import express from 'express';
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
=======
﻿// user-service/server.js

// Thay thế require bằng import
import express from 'express';
>>>>>>> 702f4c43a690c7ba1b75875c37cc7d34d40b6345
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
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
});