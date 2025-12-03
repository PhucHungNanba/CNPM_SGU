// payment-service/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/paymentRoutes.js'; // Add .js

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', paymentRoutes);
const PORT = process.env.PORT || 3004; // Or 3005 if you changed it
app.listen(PORT, () => {
    console.log(`🚀 Payment Service is running on http://localhost:${PORT}`);
});